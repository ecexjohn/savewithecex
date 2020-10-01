import { IThunderboltEntry } from '@wix/editor-elements-types';

const entry: IThunderboltEntry = {
  loadComponent: hostAPI => {
    hostAPI.registerComponent('LoginSocialBar', () => {
      return import(
        './viewer/LoginSocialBar' /* webpackChunkName: "LoginSocialBar" */
      ).then(componentModule => {
        return {
          component: componentModule.default,
        };
      });
    });
  },
};

export default entry;
