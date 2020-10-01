import { IThunderboltEntry } from '@wix/editor-elements-types';

const entry: IThunderboltEntry = {
  loadComponent: hostAPI => {
    hostAPI.registerComponent('Checkbox', () => {
      return Promise.all([
        import('./viewer/Checkbox' /* webpackChunkName: "Checkbox" */),
        import(
          './viewer/Checkbox.controller' /* webpackChunkName: "Checkbox" */
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
