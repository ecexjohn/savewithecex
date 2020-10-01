import { IThunderboltEntry } from '@wix/editor-elements-types';

const entry: IThunderboltEntry = {
  loadComponent: hostAPI => {
    hostAPI.registerComponent('StripSlideshow', () => {
      return Promise.all([
        import(
          './viewer/StripSlideshow' /* webpackChunkName: "StripSlideshow" */
        ),
        import(
          '../TPAGallery/viewer/TPAGallery.controller' /* webpackChunkName: "StripSlideshow" */
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
