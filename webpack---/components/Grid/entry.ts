import { IThunderboltEntry } from '@wix/editor-elements-types';

const entry: IThunderboltEntry = {
  loadComponent: hostAPI => {
    hostAPI.registerComponent('Grid', () => {
      return Promise.all([
        import('./viewer/Grid' /* webpackChunkName: "Grid" */),
        import('./viewer/Grid.controller' /* webpackChunkName: "Grid" */),
      ]).then(([componentModule, controllerModule]) => {
        return {
          component: componentModule.default,
          controller: controllerModule.default,
        };
      });
    });
  },
};

export default entry;
