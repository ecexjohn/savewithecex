import { IThunderboltEntry } from '@wix/editor-elements-types';

const entry: IThunderboltEntry = {
  loadComponent: hostAPI => {
    hostAPI.registerComponent('RichTextBox', () => {
      return Promise.all([
        import('./viewer/RichTextBox' /* webpackChunkName: "RichTextBox" */),
        import(
          './viewer/RichTextBox.controller' /* webpackChunkName: "RichTextBox" */
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
