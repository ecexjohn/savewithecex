import { IThunderboltEntry } from '@wix/editor-elements-types';

const entry: IThunderboltEntry = {
  loadComponent: hostAPI => {
    hostAPI.registerComponent('FacebookLikeBox', () => {
      return import(
        './viewer/FacebookLikeBox' /* webpackChunkName: "FacebookLikeBox" */
      ).then(componentModule => {
        return {
          component: componentModule.default,
        };
      });
    });
  },
};

export default entry;
