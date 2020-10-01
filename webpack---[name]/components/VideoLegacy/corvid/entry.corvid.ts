import { IVideoLegacyCorvidModel } from '../VideoLegacy.types';

const entry: IVideoLegacyCorvidModel = {
  componentType: 'Video',
  loadSDK: () =>
    import('./VideoLegacy.corvid' /* webpackChunkName: "VideoLegacy.corvid" */),
};

export default entry;
