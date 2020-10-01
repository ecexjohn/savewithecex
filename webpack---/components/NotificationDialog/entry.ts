import { IThunderboltEntry } from '@wix/editor-elements-types';

const entry: IThunderboltEntry = {
  loadComponent: hostAPI => {
    hostAPI.registerComponent('NotificationDialog', () => {
      return import(
        './viewer/NotificationDialog' /* webpackChunkName: "NotificationDialog" */
      ).then(componentModule => {
        return {
          component: componentModule.default,
        };
      });
    });
  },
};

export default entry;
