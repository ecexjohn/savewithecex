import { IThunderboltEntry } from '@wix/editor-elements-types';

const entry: IThunderboltEntry = {
  loadComponent: hostAPI => {
    hostAPI.registerComponent('StripShowcase', () => {
      return Promise.all([
        import(
          './viewer/StripShowcase' /* webpackChunkName: "StripShowcase" */
        ),
        import(
          '../TPAGallery/viewer/TPAGallery.controller' /* webpackChunkName: "StripShowcase" */
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
