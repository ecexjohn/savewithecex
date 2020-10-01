import { IThunderboltEntry } from '@wix/editor-elements-types';

const entry: IThunderboltEntry = {
  loadComponent: hostAPI => {
    hostAPI.registerComponent('MediaContainer', () => {
      return import(
        './viewer/MediaContainer' /* webpackChunkName: "MediaContainer" */
      ).then(componentModule => {
        return {
          component: componentModule.default,
        };
      });
    });

    hostAPI.registerComponent('MediaBox', () => {
      return import(
        './viewer/MediaContainer' /* webpackChunkName: "MediaContainer" */
      ).then(componentModule => {
        return {
          component: componentModule.default,
        };
      });
    });

    hostAPI.registerComponent('HoverBox', () => {
      return import(
        './viewer/MediaContainer' /* webpackChunkName: "MediaContainer" */
      ).then(componentModule => {
        return {
          component: componentModule.default,
        };
      });
    });
  },
};

export default entry;
