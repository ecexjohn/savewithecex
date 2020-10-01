import { Tpa3DGalleryCorvidModel } from '../Tpa3DGallery.types';

const entry: Tpa3DGalleryCorvidModel = {
  componentType: 'TPA3DGallery',
  sdkType: 'Gallery',
  loadSDK: () =>
    import(
      './Tpa3DGallery.corvid' /* webpackChunkName: "Tpa3DGallery.corvid" */
    ),
};

export default entry;
