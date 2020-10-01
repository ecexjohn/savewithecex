import { IThunderboltEntry } from '@wix/editor-elements-types';

const entry: IThunderboltEntry = {
  loadComponent: hostAPI => {
    hostAPI.registerComponent('Captcha', () => {
      return Promise.all([
        import('./viewer/Captcha' /* webpackChunkName: "Captcha" */),
        import('./viewer/Captcha.controller' /* webpackChunkName: "Captcha" */),
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
