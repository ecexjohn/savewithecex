import { IThunderboltEntry } from '@wix/editor-elements-types';

const entry: IThunderboltEntry = {
  loadComponent: hostAPI => {
    hostAPI.registerComponent('AudioPlayer', () => {
      return import(
        './viewer/skins/SimplePlayer/SimplePlayer' /* webpackChunkName: "AudioPlayer" */
      ).then(componentModule => {
        return {
          component: componentModule.default,
        };
      });
    });

    hostAPI.registerComponent(
      'AudioPlayer',
      () => {
        return import(
          './viewer/skins/SimplePlayer/SimplePlayer' /* webpackChunkName: "AudioPlayer_SimplePlayer" */
        ).then(componentModule => {
          return {
            component: componentModule.default,
          };
        });
      },
      'SimplePlayer',
    );

    hostAPI.registerComponent(
      'AudioPlayer',
      () => {
        return import(
          './viewer/skins/ShinyPlayer/ShinyPlayer' /* webpackChunkName: "AudioPlayer_ShinyPlayer" */
        ).then(componentModule => {
          return {
            component: componentModule.default,
          };
        });
      },
      'ShinyPlayer',
    );

    hostAPI.registerComponent(
      'AudioPlayer',
      () => {
        return import(
          './viewer/skins/BoldPlayer/BoldPlayer' /* webpackChunkName: "AudioPlayer_BoldPlayer" */
        ).then(componentModule => {
          return {
            component: componentModule.default,
          };
        });
      },
      'BoldPlayer',
    );

    hostAPI.registerComponent(
      'AudioPlayer',
      () => {
        return import(
          './viewer/skins/Audio3DPlayer/Audio3DPlayer' /* webpackChunkName: "AudioPlayer_Audio3DPlayer" */
        ).then(componentModule => {
          return {
            component: componentModule.default,
          };
        });
      },
      'Audio3DPlayer',
    );
  },
};

export default entry;
