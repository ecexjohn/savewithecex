import { IMediaContainerCorvidModel } from '../MediaContainer.types';

const entry: IMediaContainerCorvidModel = {
  componentType: 'MediaContainer',
  sdkType: 'Container',
  loadSDK: () =>
    import(
      './MediaContainer.corvid' /* webpackChunkName: "MediaContainer.corvid" */
    ),
};

export default entry;
