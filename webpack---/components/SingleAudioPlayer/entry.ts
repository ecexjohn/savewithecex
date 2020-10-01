import { IThunderboltEntry } from '@wix/editor-elements-types';

const entry: IThunderboltEntry = {
  loadComponent: hostAPI => {
    hostAPI.registerComponent(
      'SingleAudioPlayer',
      () => {
        return import(
          './viewer/skinComps/EPlayerFramedPlay/EPlayerFramedPlay.skin' /* webpackChunkName: "SingleAudioPlayer_EPlayerFramedPlay" */
        ).then(componentModule => {
          return {
            component: componentModule.default,
          };
        });
      },
      'EPlayerFramedPlay',
    );
    hostAPI.registerComponent(
      'SingleAudioPlayer',
      () => {
        return import(
          './viewer/skinComps/EPlayerLargePlay/EPlayerLargePlay.skin' /* webpackChunkName: "SingleAudioPlayer_EPlayerLargePlay" */
        ).then(componentModule => {
          return {
            component: componentModule.default,
          };
        });
      },
      'EPlayerLargePlay',
    );
    hostAPI.registerComponent(
      'SingleAudioPlayer',
      () => {
        return import(
          './viewer/skinComps/EPlayerRoundPlay/EPlayerRoundPlay.skin' /* webpackChunkName: "SingleAudioPlayer_EPlayerRoundPlay" */
        ).then(componentModule => {
          return {
            component: componentModule.default,
          };
        });
      },
      'EPlayerRoundPlay',
    );
    hostAPI.registerComponent(
      'SingleAudioPlayer',
      () => {
        return import(
          './viewer/skinComps/SingleAudioPlayerSkin/SingleAudioPlayerSkin.skin' /* webpackChunkName: "SingleAudioPlayer_SingleAudioPlayerSkin" */
        ).then(componentModule => {
          return {
            component: componentModule.default,
          };
        });
      },
      'SingleAudioPlayerSkin',
    );
  },
};

export default entry;
