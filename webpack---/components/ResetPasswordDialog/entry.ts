import { IThunderboltEntry } from '@wix/editor-elements-types';

const entry: IThunderboltEntry = {
  loadComponent: hostAPI => {
    hostAPI.registerComponent('ResetPasswordDialog', () => {
      return import(
        './viewer/ResetPasswordDialog' /* webpackChunkName: "ResetPasswordDialog" */
      ).then(componentModule => {
        return {
          component: componentModule.default,
        };
      });
    });
  },
};

export default entry;
