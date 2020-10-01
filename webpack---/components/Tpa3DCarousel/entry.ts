import { IThunderboltEntry } from '@wix/editor-elements-types';

const entry: IThunderboltEntry = {
  loadComponent: hostAPI => {
    hostAPI.registerComponent('TPA3DCarousel', () => {
      return Promise.all([
        import(
          './viewer/Tpa3DCarousel' /* webpackChunkName: "Tpa3DCarousel" */
        ),
        import(
          '../TPAGallery/viewer/TPAGallery.controller' /* webpackChunkName: "Tpa3DCarousel" */
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
