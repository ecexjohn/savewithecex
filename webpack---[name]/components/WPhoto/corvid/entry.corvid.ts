import { IWPhotoCorvidModel } from '../WPhoto.types';

const entry: IWPhotoCorvidModel = {
  componentType: 'WPhoto',
  sdkType: 'Image',
  loadSDK: () =>
    import('./WPhoto.corvid' /* webpackChunkName: "WPhoto.corvid" */),
};

export default entry;
