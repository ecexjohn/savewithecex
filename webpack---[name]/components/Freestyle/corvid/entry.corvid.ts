import { FreestyleCorvidModel } from '../Freestyle.types';

const entry: FreestyleCorvidModel = {
  componentType: 'Freestyle',
  sdkType: 'Gallery',
  loadSDK: () =>
    import('./Freestyle.corvid' /* webpackChunkName: "Freestyle.corvid" */),
};

export default entry;
