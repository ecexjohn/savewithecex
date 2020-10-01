import { IThunderboltEntry } from '@wix/editor-elements-types';

const entry: IThunderboltEntry = {
  loadComponent: hostAPI => {
    hostAPI.registerComponent('PayPalButton', () => {
      return import(
        './viewer/PayPalButton' /* webpackChunkName: "PayPalButton" */
      ).then(componentModule => {
        return {
          component: componentModule.default,
        };
      });
    });
  },
};

export default entry;
