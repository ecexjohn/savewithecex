import { MasonryCorvidModel } from '../Masonry.types';

const entry: MasonryCorvidModel = {
  componentType: 'Masonry',
  sdkType: 'Gallery',
  loadSDK: () =>
    import('./Masonry.corvid' /* webpackChunkName: "Masonry.corvid" */),
};

export default entry;
