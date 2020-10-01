import { IThunderboltEntry } from '@wix/editor-elements-types';

const entry: IThunderboltEntry = {
  loadComponent: hostAPI => {
    hostAPI.registerComponent('SlideShowContainer', () => {
      return Promise.all([
        import(
          './viewer/SlideShowContainer' /* webpackChunkName: "SlideShowContainer" */
        ),
        import(
          './viewer/SlideShowContainer.controller' /* webpackChunkName: "SlideShowContainer" */
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
