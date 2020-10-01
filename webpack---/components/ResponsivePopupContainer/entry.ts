import { IThunderboltEntry } from '@wix/editor-elements-types';

const entry: IThunderboltEntry = {
  loadComponent: hostAPI => {
    hostAPI.registerComponent('ResponsivePopupContainer', () => {
      return import(
        './viewer/ResponsivePopupContainer' /* webpackChunkName: "ResponsivePopupContainer" */
      ).then(componentModule => {
        return {
          component: componentModule.default,
        };
      });
    });
  },
};

export default entry;
