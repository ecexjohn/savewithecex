import { IThunderboltEntry } from '@wix/editor-elements-types';

const entry: IThunderboltEntry = {
  loadComponent: hostAPI => {
    hostAPI.registerComponent('ResponsivePopupPage', () => {
      return import(
        './viewer/ResponsivePopupPage' /* webpackChunkName: "ResponsivePopupPage" */
      ).then(componentModule => {
        return {
          component: componentModule.default,
        };
      });
    });
  },
};

export default entry;
