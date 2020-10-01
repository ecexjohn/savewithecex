import { IThunderboltEntry } from '@wix/editor-elements-types';

const entry: IThunderboltEntry = {
  loadComponent: hostAPI => {
    hostAPI.registerComponent('ConfirmationEmailDialog', () => {
      return import(
        './viewer/ConfirmationEmailDialog' /* webpackChunkName: "ConfirmationEmailDialog" */
      ).then(componentModule => {
        return {
          component: componentModule.default,
        };
      });
    });
  },
};

export default entry;
