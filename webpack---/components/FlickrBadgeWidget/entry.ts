import { IThunderboltEntry } from '@wix/editor-elements-types';

const entry: IThunderboltEntry = {
  loadComponent: hostAPI => {
    hostAPI.registerComponent('FlickrBadgeWidget', () => {
      return import(
        './viewer/FlickrBadgeWidget' /* webpackChunkName: "FlickrBadgeWidget" */
      ).then(componentModule => {
        return {
          component: componentModule.default,
        };
      });
    });
  },
};

export default entry;
