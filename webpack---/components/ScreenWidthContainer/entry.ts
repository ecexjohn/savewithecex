import { IThunderboltEntry } from '@wix/editor-elements-types';

const entry: IThunderboltEntry = {
  loadComponent: hostAPI => {
    // TODO - split by uiType
    hostAPI.registerComponent('ScreenWidthContainer', () => {
      return import(
        /* webpackChunkName: "ScreenWidthContainer" */
        './viewer/ScreenWidthContainer'
      ).then(componentModule => {
        return {
          component: componentModule.default,
        };
      });
    });
  },
};

export default entry;
