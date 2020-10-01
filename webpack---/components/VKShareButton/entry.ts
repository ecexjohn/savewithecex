import { IThunderboltEntry } from '@wix/editor-elements-types';

const entry: IThunderboltEntry = {
  loadComponent: hostAPI => {
    hostAPI.registerComponent('VKShareButton', () => {
      return import(
        './viewer/VKShareButton' /* webpackChunkName: "VKShareButton" */
      ).then(componentModule => ({
        component: componentModule.default,
      }));
    });
  },
};

export default entry;
