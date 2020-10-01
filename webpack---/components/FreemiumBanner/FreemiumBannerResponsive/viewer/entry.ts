import { IThunderboltEntry } from '@wix/editor-elements-types';

const entry: IThunderboltEntry = {
  loadComponent: hostAPI => {
    hostAPI.registerComponent('FreemiumBannerResponsive', () => {
      return import(
        './FreemiumBannerResponsive' /* webpackChunkName: "FreemiumBannerResponsive" */
      ).then(componentModule => {
        return {
          component: componentModule.default,
        };
      });
    });
  },
};

export default entry;
