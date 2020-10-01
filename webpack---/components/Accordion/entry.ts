import { IThunderboltEntry } from '@wix/editor-elements-types';

const entry: IThunderboltEntry = {
  loadComponent: hostAPI => {
    hostAPI.registerComponent('Accordion', () => {
      return Promise.all([
        import('./viewer/Accordion' /* webpackChunkName: "Accordion" */),
        import(
          '../TPAGallery/viewer/TPAGallery.controller' /* webpackChunkName: "Accordion" */
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
