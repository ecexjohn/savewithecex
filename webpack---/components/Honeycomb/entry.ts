import { IThunderboltEntry } from '@wix/editor-elements-types';

const entry: IThunderboltEntry = {
  loadComponent: hostAPI => {
    hostAPI.registerComponent('Honeycomb', () => {
      return Promise.all([
        import('./viewer/Honeycomb' /* webpackChunkName: "Honeycomb" */),
        import(
          '../TPAGallery/viewer/TPAGallery.controller' /* webpackChunkName: "Honeycomb" */
        ),
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
