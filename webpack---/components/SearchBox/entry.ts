import { IThunderboltEntry } from '@wix/editor-elements-types';

const entry: IThunderboltEntry = {
  loadComponent: hostAPI => {
    hostAPI.registerComponent('SearchBox', () => {
      return Promise.all([
        import('./viewer/SearchBox' /* webpackChunkName: "SearchBox" */),
        import(
          './viewer/SearchBox.controller' /* webpackChunkName: "SearchBox" */
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
