import { IThunderboltEntry } from '@wix/editor-elements-types';

const entry: IThunderboltEntry = {
  loadComponent: hostAPI => {
    hostAPI.registerComponent('PopupCloseIconButton', () => {
      return import(
        './viewer/PopupCloseIconButton' /* webpackChunkName: "PopupCloseIconButton" */
      ).then(componentModule => {
        return {
          component: componentModule.default,
        };
      });
    });
  },
};

export default entry;
