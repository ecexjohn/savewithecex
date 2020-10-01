import { CollageCorvidModel } from '../Collage.types';

const entry: CollageCorvidModel = {
  componentType: 'Collage',
  sdkType: 'Gallery',
  loadSDK: () =>
    import('./Collage.corvid' /* webpackChunkName: "Collage.corvid" */),
};

export default entry;
