import { StripSlideshowCorvidModel } from '../StripSlideshow.types';

const entry: StripSlideshowCorvidModel = {
  componentType: 'StripSlideshow',
  sdkType: 'Gallery',
  loadSDK: () =>
    import(
      './StripSlideshow.corvid' /* webpackChunkName: "StripSlideshow.corvid" */
    ),
};

export default entry;
