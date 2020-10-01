import { ISlideShowSlideCorvidModel } from '../SlideShowSlide.types';

const entry: ISlideShowSlideCorvidModel = {
  componentType: 'SlideShowSlide',
  sdkType: 'Slide',
  loadSDK: () =>
    import(
      './SlideShowSlide.corvid' /* webpackChunkName: "SlideShowSlide.corvid" */
    ),
};

export default entry;
