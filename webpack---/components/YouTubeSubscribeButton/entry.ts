import { IThunderboltEntry } from '@wix/editor-elements-types';

const entry: IThunderboltEntry = {
  loadComponent: hostAPI => {
    hostAPI.registerComponent('YouTubeSubscribeButton', () => {
      return import(
        './viewer/YouTubeSubscribeButton' /* webpackChunkName: "YouTubeSubscribeButton" */
      ).then(componentModule => {
        return {
          component: componentModule.default,
        };
      });
    });
  },
};

export default entry;
