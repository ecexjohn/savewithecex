import { IThunderboltEntry } from '@wix/editor-elements-types';

const entry: IThunderboltEntry = {
  loadComponent: hostAPI => {
    hostAPI.registerComponent('DisqusComments', () => {
      return import(
        './viewer/DisqusComments' /* webpackChunkName: "DisqusComments" */
      ).then(componentModule => ({ component: componentModule.default }));
    });
  },
};

export default entry;
