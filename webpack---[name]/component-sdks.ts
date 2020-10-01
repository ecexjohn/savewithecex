import {
  CorvidSDKFactory,
  ICorvidModel,
  CorvidSDKModule,
} from '@wix/editor-elements-types';
import { PlatformLogger } from '@wix/thunderbolt-platform-types';
import { importAll, retry } from './build-utils';
import fallbackSDK from './core/corvid/Fallback/entry.corvid';

function createSdkLoader(
  componentEntries: Array<ICorvidModel>,
): Record<string, () => Promise<CorvidSDKModule>> {
  return componentEntries.reduce<
    Record<string, () => Promise<CorvidSDKModule>>
  >((loader, entry) => {
    const { componentType, loadSDK } = entry;
    if (!componentType || !loadSDK) {
      throw new Error(
        'Error generating Corvid SDK loader! Corvid SDK entry (ComponentName/corvid/entry.corvid.ts) must be of type `ICorvidModel`',
      );
    }
    loader[componentType] = loadSDK;
    return loader;
  }, {});
}

function createSdkTypesMap(entries: Array<ICorvidModel>) {
  return entries.reduce<Record<string, Array<string>>>((acc, entry) => {
    const { sdkType, componentType } = entry;
    const key = sdkType || componentType;
    if (key) {
      acc[key] = acc[key] ? acc[key].concat(componentType) : [componentType];
    }
    return acc;
  }, {});
}

const componentEntriesContext = require.context(
  './components',
  true,
  /entry\.corvid\.ts$/,
);

const coreComponentsEntriesContext = require.context(
  './thunderbolt-core-components',
  true,
  /entry\.corvid\.ts$/,
);

const componentEntries = importAll<ICorvidModel>(componentEntriesContext);
const coreComponentsEntries = importAll<ICorvidModel>(
  coreComponentsEntriesContext,
);

const allEntries = coreComponentsEntries.concat(componentEntries);

const sdkLoaders = createSdkLoader(allEntries);

export const sdkTypeToComponentTypes = createSdkTypesMap(allEntries);

export const loadComponentSdks = (
  componentsTypes: Array<string> = [],
  logger: PlatformLogger,
) => {
  const failedSDKTypes: Array<string> = [];
  const loaders = componentsTypes.map(componentType =>
    sdkLoaders[componentType]
      ? retry(sdkLoaders[componentType], { times: 3 })().catch(
          (reason: Error | string) => {
            failedSDKTypes.push(componentType);
            return Promise.reject(reason);
          },
        )
      : fallbackSDK.loadSDK(),
  );

  return Promise.all(loaders)
    .then(loadedSDKs => {
      return loadedSDKs.reduce((acc, currentValue, index) => {
        acc[componentsTypes[index]] = currentValue ? currentValue.sdk : null;
        return acc;
      }, {} as Record<string, CorvidSDKFactory | null>);
    })
    .catch((reason: Error | string) => {
      const error = new Error();
      error.name = 'LoadSdkError';
      error.stack = reason instanceof Error ? reason.stack : error.stack;
      error.message = `${
        reason instanceof Error ? reason.message : reason
      }\nSDKs that failed to load: ${failedSDKTypes}`;
      logger.captureError(error, {
        extra: { compTypes: componentsTypes, error },
      });
      return Promise.reject(error);
    });
};
