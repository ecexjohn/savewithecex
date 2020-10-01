import { IThunderboltEntry } from '@wix/editor-elements-types';

const entry: IThunderboltEntry = {
  loadComponent: hostAPI => {
    hostAPI.registerComponent('MusicPlayer', () => {
      return Promise.all([
        import('./viewer/MusicPlayer' /* webpackChunkName: "MusicPlayer" */),
        import(
          './viewer/MusicPlayer.controller' /* webpackChunkName: "MusicPlayer" */
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
