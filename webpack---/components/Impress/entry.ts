import { IThunderboltEntry } from '@wix/editor-elements-types';

const entry: IThunderboltEntry = {
  loadComponent: hostAPI => {
    hostAPI.registerComponent('Impress', () => {
      return Promise.all([
        import('./viewer/Impress' /* webpackChunkName: "Impress" */),
        import(
          '../TPAGallery/viewer/TPAGallery.controller' /* webpackChunkName: "Impress" */
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
