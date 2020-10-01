import { IThunderboltEntry } from '@wix/editor-elements-types';

const entry: IThunderboltEntry = {
  loadComponent: hostAPI => {
    hostAPI.registerComponent('TextAreaInput', () => {
      return Promise.all([
        import(
          './viewer/TextAreaInput' /* webpackChunkName: "TextAreaInput" */
        ),
        import(
          './viewer/TextAreaInput.controller' /* webpackChunkName: "TextAreaInput" */
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
