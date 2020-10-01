import { IThunderboltEntry } from '@wix/editor-elements-types';

const entry: IThunderboltEntry = {
  loadComponent: hostAPI => {
    hostAPI.registerComponent('RequestPasswordResetDialog', () => {
      return import(
        './viewer/RequestPasswordResetDialog' /* webpackChunkName: "RequestPasswordResetDialog" */
      ).then(componentModule => {
        return {
          component: componentModule.default,
        };
      });
    });
  },
};

export default entry;
