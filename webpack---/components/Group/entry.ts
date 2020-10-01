import { IThunderboltEntry } from '@wix/editor-elements-types';

const entry: IThunderboltEntry = {
  loadComponent: hostAPI => {
    hostAPI.registerComponent('Group', () => {
      return import('./viewer/Group' /* webpackChunkName: "Group" */).then(
        componentModule => {
          return {
            component: componentModule.default,
          };
        },
      );
    });
  },
};

export default entry;
