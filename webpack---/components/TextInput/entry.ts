import { IThunderboltEntry } from '@wix/editor-elements-types';

const entry: IThunderboltEntry = {
  loadComponent: hostAPI => {
    hostAPI.registerComponent('TextInput', () => {
      return Promise.all([
        import('./viewer/TextInput' /* webpackChunkName: "TextInput" */),
        import(
          './viewer/TextInput.controller' /* webpackChunkName: "TextInput" */
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
