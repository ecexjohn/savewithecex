import { IThunderboltEntry } from '@wix/editor-elements-types';

const entry: IThunderboltEntry = {
  loadComponent: hostAPI => {
    hostAPI.registerComponent('FileUploader', async () => {
      return Promise.all([
        import('./viewer/FileUploader' /* webpackChunkName: "FileUploader" */),
        import(
          './viewer/FileUploader.controller' /* webpackChunkName: "FileUploader" */
        ),
      ]).then(([componentModule, controllerModule]) => {
        return {
          component: componentModule.default,
          controller: controllerModule.default,
        };
      });
    });
  },
};

export default entry;
