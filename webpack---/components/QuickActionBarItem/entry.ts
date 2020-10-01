import { IThunderboltEntry } from '@wix/editor-elements-types';

const entry: IThunderboltEntry = {
  loadComponent: hostAPI => {
    hostAPI.registerComponent('QuickActionBarItem', () => {
      return import(
        './viewer/QuickActionBarItem' /* webpackChunkName: "QuickActionBarItem" */
      ).then(component => {
        return {
          component: component.default,
        };
      });
    });
  },
};

export default entry;
