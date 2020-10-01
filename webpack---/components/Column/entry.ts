import { IThunderboltEntry } from '@wix/editor-elements-types';
import { componentType } from './constants';

const entry: IThunderboltEntry = {
  loadComponent: hostAPI => {
    hostAPI.registerComponent(componentType, () => {
      return import(
        '../MediaContainer/viewer/MediaContainer' /* webpackChunkName: "Column" */
      ).then(componentModule => {
        return {
          component: componentModule.default,
        };
      });
    });
  },
};

export default entry;
