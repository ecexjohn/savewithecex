import { IThunderboltEntry } from '@wix/editor-elements-types';

const entry: IThunderboltEntry = {
  loadComponent: hostAPI => {
    hostAPI.registerComponent('EnterPasswordDialog', () => {
      return import(
        './viewer/EnterPasswordDialog' /* webpackChunkName: "EnterPasswordDialog" */
      ).then(componentModule => {
        return {
          component: componentModule.default,
        };
      });
    });
  },
};

export default entry;
