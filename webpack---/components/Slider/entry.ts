import { IThunderboltEntry } from '@wix/editor-elements-types';

const entry: IThunderboltEntry = {
  loadComponent: hostAPI => {
    hostAPI.registerComponent('Slider', () => {
      return Promise.all([
        import('./viewer/Slider' /* webpackChunkName: "Slider" */),
        import('./viewer/Slider.controller' /* webpackChunkName: "Slider" */),
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
