import { IImageXCorvidModel } from '../ImageX.types';

const entry: IImageXCorvidModel = {
  componentType: 'ImageX',
  sdkType: 'Image',
  loadSDK: () =>
    import('./ImageX.corvid' /* webpackChunkName: "ImageX.corvid" */),
};

export default entry;
