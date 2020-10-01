import { IThunderboltEntry } from '@wix/editor-elements-types';

const entry: IThunderboltEntry = {
  loadComponent: hostAPI => {
    hostAPI.registerComponent('SignUpDialog', () => {
      return Promise.all([
        import('./viewer/SignUpDialog' /* webpackChunkName: "SignUpDialog" */),
        import(
          './viewer/SignUpDialog.controller' /* webpackChunkName: "SignUpDialog" */
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
