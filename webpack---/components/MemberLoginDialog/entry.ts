import { IThunderboltEntry } from '@wix/editor-elements-types';

const entry: IThunderboltEntry = {
  loadComponent: hostAPI => {
    hostAPI.registerComponent('MemberLoginDialog', () => {
      return Promise.all([
        import(
          './viewer/MemberLoginDialog' /* webpackChunkName: "MemberLoginDialog" */
        ),
        import(
          './viewer/MemberLoginDialog.controller' /* webpackChunkName: "MemberLoginDialog" */
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
