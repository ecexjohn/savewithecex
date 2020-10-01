import { ISlideShowGalleryCorvidModel } from '../SlideShowGallery.types';

const entry: ISlideShowGalleryCorvidModel = {
  componentType: 'SlideShowGallery',
  sdkType: 'Gallery',
  loadSDK: () =>
    import(
      './SlideShowGallery.corvid' /* webpackChunkName: "SlideShowGallery.corvid" */
    ),
};

export default entry;
