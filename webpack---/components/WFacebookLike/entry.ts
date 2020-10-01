import { IThunderboltEntry } from '@wix/editor-elements-types';

const entry: IThunderboltEntry = {
  loadComponent: hostAPI => {
    hostAPI.registerComponent('WFacebookLike', () => {
      return import(
        './viewer/WFacebookLike' /* webpackChunkName: "WFacebookLike" */
      ).then(componentModule => {
        return {
          component: componentModule.default,
        };
      });
    });
  },
};

export default entry;
