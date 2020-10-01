import { IThunderboltEntry } from '@wix/editor-elements-types';

const entry: IThunderboltEntry = {
  loadComponent: hostAPI => {
    hostAPI.registerComponent('Freestyle', () => {
      return Promise.all([
        import('./viewer/Freestyle' /* webpackChunkName: "Freestyle" */),
        import(
          '../TPAGallery/viewer/TPAGallery.controller' /* webpackChunkName: "Freestyle" */
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
