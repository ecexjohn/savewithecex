import { ISlideShowContainerCorvidModel } from '../SlideShowContainer.types';

const entry: ISlideShowContainerCorvidModel = {
  componentType: 'SlideShowContainer',
  loadSDK: () =>
    import(
      './SlideShowContainer.corvid' /* webpackChunkName: "SlideShowContainer.corvid" */
    ),
};

export default entry;
