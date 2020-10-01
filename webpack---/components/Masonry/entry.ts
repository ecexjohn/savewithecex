import { IThunderboltEntry } from '@wix/editor-elements-types';

const entry: IThunderboltEntry = {
  loadComponent: hostAPI => {
    hostAPI.registerComponent('Masonry', () => {
      return Promise.all([
        import('./viewer/Masonry' /* webpackChunkName: "Masonry" */),
        import(
          '../TPAGallery/viewer/TPAGallery.controller' /* webpackChunkName: "Masonry" */
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
