import { StripShowcaseCorvidModel } from '../StripShowcase.types';

const entry: StripShowcaseCorvidModel = {
  componentType: 'StripShowcase',
  sdkType: 'Gallery',
  loadSDK: () =>
    import(
      './StripShowcase.corvid' /* webpackChunkName: "StripShowcase.corvid" */
    ),
};

export default entry;
