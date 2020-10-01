import { IThunderboltEntry } from '@wix/editor-elements-types';

const entry: IThunderboltEntry = {
  loadComponent: hostAPI => {
    hostAPI.registerComponent('Video', async () => {
      const componentModule = await import(
        './viewer/VideoLegacy' /* webpackChunkName: "VideoLegacy" */
      );
      return {
        component: componentModule.default,
      };
    });
  },
};

export default entry;
