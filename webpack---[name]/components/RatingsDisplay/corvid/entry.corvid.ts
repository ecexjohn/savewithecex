import { IRatingsDisplayCorvidModel } from '../RatingsDisplay.types';

const entry: IRatingsDisplayCorvidModel = {
  componentType: 'RatingsDisplay',
  loadSDK: () =>
    import(
      './RatingsDisplay.corvid' /* webpackChunkName: "RatingsDisplay.corvid" */
    ),
};

export default entry;
