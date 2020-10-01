import { IThunderboltEntry } from '@wix/editor-elements-types';

const entry: IThunderboltEntry = {
  loadComponent: hostAPI => {
    hostAPI.registerComponent('CheckboxGroup', () => {
      return Promise.all([
        import(
          './viewer/CheckboxGroup' /* webpackChunkName: "CheckboxGroup" */
        ),
        import(
          './viewer/CheckboxGroup.controller' /* webpackChunkName: "CheckboxGroup" */
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
