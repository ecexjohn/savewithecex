import { IThunderboltEntry } from '@wix/editor-elements-types';

const entry: IThunderboltEntry = {
  loadComponent: hostAPI => {
    hostAPI.registerComponent('Collage', () => {
      return Promise.all([
        import('./viewer/Collage' /* webpackChunkName: "Collage" */),
        import(
          '../TPAGallery/viewer/TPAGallery.controller' /* webpackChunkName: "Collage" */
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
