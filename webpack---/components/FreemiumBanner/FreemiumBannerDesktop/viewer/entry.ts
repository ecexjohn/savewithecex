import { IThunderboltEntry } from '@wix/editor-elements-types';

const entry: IThunderboltEntry = {
  loadComponent: hostAPI => {
    hostAPI.registerComponent('FreemiumBannerDesktop', () => {
      return import(
        './FreemiumBannerDesktop' /* webpackChunkName: "FreemiumBannerDesktop" */
      ).then(componentModule => {
        return {
          component: componentModule.default,
        };
      });
    });
  },
};

export default entry;
