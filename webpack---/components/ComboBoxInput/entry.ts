import { IThunderboltEntry } from '@wix/editor-elements-types';

const entry: IThunderboltEntry = {
  loadComponent: hostAPI => {
    hostAPI.registerComponent('ComboBoxInput', () => {
      return Promise.all([
        import(
          './viewer/skinComps/Basic/ComboBoxInput.skin' /* webpackChunkName: "ComboBoxInput" */
        ),
        import(
          './viewer/ComboBoxInput.controller' /* webpackChunkName: "ComboBoxInput" */
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
