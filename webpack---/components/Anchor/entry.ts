import { IThunderboltEntry } from '@wix/editor-elements-types';

const entry: IThunderboltEntry = {
  loadComponent: hostAPI => {
    hostAPI.registerComponent('Anchor', () => {
      return import('./viewer/Anchor' /* webpackChunkName: "Anchor" */).then(
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
