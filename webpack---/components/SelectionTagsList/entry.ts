import { IThunderboltEntry } from '@wix/editor-elements-types';

const entry: IThunderboltEntry = {
  loadComponent: hostAPI => {
    hostAPI.registerComponent('SelectionTagsList', () => {
      return Promise.all([
        import(
          './viewer/SelectionTagsList' /* webpackChunkName: "SelectionTagsList" */
        ),
        import(
          './viewer/SelectionTagsList.controller' /* webpackChunkName: "SelectionTagsList" */
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
