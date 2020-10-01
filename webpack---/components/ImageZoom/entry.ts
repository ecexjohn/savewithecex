import { IThunderboltEntry } from '@wix/editor-elements-types';

const entry: IThunderboltEntry = {
  loadComponent: hostAPI => {
    hostAPI.registerComponent('ImageZoom', () => {
      return import(
        './viewer/ImageZoom' /* webpackChunkName: "ImageZoom" */
      ).then(componentModule => {
        return {
          component: componentModule.default,
        };
      });
    });
    hostAPI.registerComponent('TouchMediaZoom', () => {
      return import(
        './viewer/TouchMediaZoom' /* webpackChunkName: "TouchMediaZoom" */
      ).then(componentModule => {
        return {
          component: componentModule.default,
        };
      });
    });
  },
};

export default entry;
