import { Tpa3DCarouselCorvidModel } from '../Tpa3DCarousel.types';

const entry: Tpa3DCarouselCorvidModel = {
  componentType: 'TPA3DCarousel',
  sdkType: 'Gallery',
  loadSDK: () =>
    import(
      './Tpa3DCarousel.corvid' /* webpackChunkName: "Tpa3DCarousel.corvid" */
    ),
};

export default entry;
