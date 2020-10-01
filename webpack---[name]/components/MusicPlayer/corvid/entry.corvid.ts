import { IMusicPlayerCorvidModel } from '../MusicPlayer.types';

const entry: IMusicPlayerCorvidModel = {
  componentType: 'MusicPlayer',
  sdkType: 'AudioPlayer',
  loadSDK: () =>
    import('./MusicPlayer.corvid' /* webpackChunkName: "MusicPlayer.corvid" */),
};

export default entry;
