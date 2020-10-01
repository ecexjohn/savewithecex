import { IThunderboltEntry } from '@wix/editor-elements-types';

const entry: IThunderboltEntry = {
  loadComponent: hostAPI => {
    hostAPI.registerComponent('FreemiumBannerMobile', () => {
      return import(
        './FreemiumBannerMobile' /* webpackChunkName: "FreemiumBannerMobile" */
      ).then(componentModule => {
        return {
          component: componentModule.default,
        };
      });
    });
  },
};

export default entry;
