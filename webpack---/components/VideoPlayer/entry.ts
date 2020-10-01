import { IThunderboltEntry } from '@wix/editor-elements-types';

const entry: IThunderboltEntry = {
  loadComponent: hostAPI => {
    hostAPI.registerComponent('VideoPlayer', () => {
      return Promise.all([
        import('./viewer/VideoPlayer' /* webpackChunkName: "VideoPlayer" */),
        import(
          './viewer/VideoPlayer.controller' /* webpackChunkName: "VideoPlayer" */
        ),
      ]).then(([componentModule, controllerModule]) => {
        return {
          component: componentModule.default,
          controller: controllerModule.default,
        };
      });
    });
  },
};

export default entry;
