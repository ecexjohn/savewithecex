import { IThunderboltEntry } from '@wix/editor-elements-types';

const entry: IThunderboltEntry = {
  loadComponent: hostAPI => {
    hostAPI.registerComponent('StripColumnsContainer', () => {
      return import(
        './viewer/StripColumnsContainer' /* webpackChunkName: "StripColumnsContainer" */
      ).then(componentModule => {
        return {
          component: componentModule.default,
        };
      });
    });
  },
};

export default entry;
