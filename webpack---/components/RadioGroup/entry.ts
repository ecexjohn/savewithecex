import { IThunderboltEntry } from '@wix/editor-elements-types';

const entry: IThunderboltEntry = {
  loadComponent: hostAPI => {
    hostAPI.registerComponent('RadioGroup', () => {
      return Promise.all([
        import('./viewer/RadioGroup' /* webpackChunkName: "RadioGroup" */),
        import(
          './viewer/RadioGroup.controller' /* webpackChunkName: "RadioGroup" */
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
