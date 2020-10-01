import { IContainerCorvidModel } from '../Container.types';

const entry: IContainerCorvidModel = {
  componentType: 'Container',
  sdkType: 'Box',
  loadSDK: () =>
    import('./Container.corvid' /* webpackChunkName: "Container.corvid" */),
};

export default entry;
