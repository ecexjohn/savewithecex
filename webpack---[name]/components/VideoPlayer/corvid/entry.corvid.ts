import { IVideoPlayerCorvidModel } from '../VideoPlayer.types';

const entry: IVideoPlayerCorvidModel = {
  componentType: 'VideoPlayer',
  loadSDK: () =>
    import('./VideoPlayer.corvid' /* webpackChunkName: "VideoPlayer.corvid" */),
};

export default entry;
