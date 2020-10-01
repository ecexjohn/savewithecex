import { IThunderboltEntry } from '@wix/editor-elements-types';

const entry: IThunderboltEntry = {
  loadComponent: hostAPI => {
    hostAPI.registerComponent('Thumbnails', () => {
      return Promise.all([
        import('./viewer/Thumbnails' /* webpackChunkName: "Thumbnails" */),
        import(
          '../TPAGallery/viewer/TPAGallery.controller' /* webpackChunkName: "Thumbnails" */
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
