import { IThunderboltEntry } from '@wix/editor-elements-types';

const entry: IThunderboltEntry = {
  loadComponent: hostAPI => {
    hostAPI.registerComponent('TPA3DGallery', () => {
      return Promise.all([
        import('./viewer/Tpa3DGallery' /* webpackChunkName: "Tpa3DGallery" */),
        import(
          '../TPAGallery/viewer/TPAGallery.controller' /* webpackChunkName: "Tpa3DGallery" */
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
