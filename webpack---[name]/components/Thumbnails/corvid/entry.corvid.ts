import { ThumbnailsCorvidModel } from '../Thumbnails.types';

const entry: ThumbnailsCorvidModel = {
  componentType: 'Thumbnails',
  sdkType: 'Gallery',
  loadSDK: () =>
    import('./Thumbnails.corvid' /* webpackChunkName: "Thumbnails.corvid" */),
};

export default entry;
