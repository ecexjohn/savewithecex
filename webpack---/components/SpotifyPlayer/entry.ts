import { IThunderboltEntry } from '@wix/editor-elements-types';

const entry: IThunderboltEntry = {
  loadComponent: hostAPI => {
    hostAPI.registerComponent('SpotifyPlayer', () => {
      return import(
        './viewer/SpotifyPlayer' /* webpackChunkName: "SpotifyPlayer" */
      ).then(componentModule => {
        return {
          component: componentModule.default,
        };
      });
    });
  },
};

export default entry;
