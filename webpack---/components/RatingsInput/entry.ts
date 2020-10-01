import { IThunderboltEntry } from '@wix/editor-elements-types';

const entry: IThunderboltEntry = {
  loadComponent: hostAPI => {
    hostAPI.registerComponent('RatingsInput', () => {
      return Promise.all([
        import('./viewer/RatingsInput' /* webpackChunkName: "RatingsInput" */),
        import(
          './viewer/RatingsInput.controller' /* webpackChunkName: "RatingsInput" */
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
