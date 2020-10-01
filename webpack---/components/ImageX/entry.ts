import { IThunderboltEntry } from '@wix/editor-elements-types';

const entry: IThunderboltEntry = {
  loadComponent: hostAPI => {
    hostAPI.registerComponent('ImageX', () => {
      return import('./viewer/ImageX' /* webpackChunkName: "ImageX" */).then(
        componentModule => {
          return {
            component: componentModule.default,
          };
        },
      );
    });
  },
};

export default entry;
