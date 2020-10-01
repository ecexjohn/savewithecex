import { IThunderboltEntry } from '@wix/editor-elements-types';

const entry: IThunderboltEntry = {
  loadComponent: hostAPI => {
    hostAPI.registerComponent('LinkBar', () => {
      return import('./viewer/LinkBar' /* webpackChunkName: "LinkBar" */).then(
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
