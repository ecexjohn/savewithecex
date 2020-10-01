import { IThunderboltEntry } from '@wix/editor-elements-types';

const entry: IThunderboltEntry = {
  loadComponent: hostAPI => {
    hostAPI.registerComponent(
      'MediaPlayer',
      () => {
        return import(
          './viewer/VideoBox' /* webpackChunkName: "VideoBox" */
        ).then(componentModule => {
          return {
            component: componentModule.default,
          };
        });
      },
      'videoBox',
    );

    hostAPI.registerComponent(
      'MediaPlayer',
      () => {
        return import(
          './viewer/VideoBoxResponsive' /* webpackChunkName: "VideoBoxResponsive" */
        ).then(componentModule => {
          return {
            component: componentModule.default,
          };
        });
      },
      'videoBoxResponsive',
    );

    hostAPI.registerComponent(
      'MediaPlayer',
      () => {
        return import(
          './viewer/TransparentVideo' /* webpackChunkName: "TransparentVideo" */
        ).then(componentModule => {
          return {
            component: componentModule.default,
          };
        });
      },
      'transparentVideo',
    );

    hostAPI.registerComponent(
      'MediaPlayer',
      () => {
        return import(
          './viewer/TransparentVideoResponsive' /* webpackChunkName: "TransparentVideoResponsive" */
        ).then(componentModule => {
          return {
            component: componentModule.default,
          };
        });
      },
      'transparentVideoResponsive',
    );

    hostAPI.registerComponent('MediaOverlayControls', () => {
      return import(
        './viewer/VideoBoxPlay' /* webpackChunkName: "VideoBoxPlay" */
      ).then(componentModule => {
        return {
          component: componentModule.default,
        };
      });
    });

    hostAPI.registerComponent('MediaControls', () => {
      return import(
        './viewer/VideoBoxAudio' /* webpackChunkName: "VideoBoxAudio" */
      ).then(componentModule => {
        return {
          component: componentModule.default,
        };
      });
    });
  },
};

export default entry;
