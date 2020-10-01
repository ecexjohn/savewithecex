import { IThunderboltEntry } from '@wix/editor-elements-types';

const entry: IThunderboltEntry = {
  loadComponent: hostAPI => {
    hostAPI.registerComponent('SoundCloudWidget', () => {
      return import(
        './viewer/SoundCloudWidget' /* webpackChunkName: "SoundCloudWidget" */
      ).then(componentModule => {
        return {
          component: componentModule.default,
        };
      });
    });
  },
};

export default entry;
