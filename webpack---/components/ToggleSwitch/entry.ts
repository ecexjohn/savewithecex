import { IThunderboltEntry } from '@wix/editor-elements-types';

const entry: IThunderboltEntry = {
  loadComponent: hostAPI => {
    hostAPI.registerComponent('ToggleSwitch', () => {
      return Promise.all([
        import('./viewer/ToggleSwitch' /* webpackChunkName: "ToggleSwitch" */),
        import(
          './viewer/ToggleSwitch.controller' /* webpackChunkName: "ToggleSwitch" */
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
