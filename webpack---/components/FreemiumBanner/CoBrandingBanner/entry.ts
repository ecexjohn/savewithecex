import { IThunderboltEntry } from '@wix/editor-elements-types';

const entry: IThunderboltEntry = {
  loadComponent: hostAPI => {
    hostAPI.registerComponent('CoBrandingBannerDesktop', () => {
      return import(
        './viewer/CoBrandingBannerDesktop' /* webpackChunkName: "CoBrandingBannerDesktop" */
      ).then(componentModule => {
        return {
          component: componentModule.default,
        };
      });
    });
    hostAPI.registerComponent('CoBrandingBannerMobile', () => {
      return import(
        './viewer/CoBrandingBannerMobile' /* webpackChunkName: "CoBrandingBannerMobile" */
      ).then(componentModule => {
        return {
          component: componentModule.default,
        };
      });
    });
  },
};

export default entry;
