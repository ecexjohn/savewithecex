import { IThunderboltEntry } from '@wix/editor-elements-types';

const entry: IThunderboltEntry = {
  loadComponent: hostAPI => {
    hostAPI.registerComponent('RSSButton', () => {
      return import('./viewer/RSSButton').then(componentModule => ({
        component: componentModule.default,
      }));
    });
  },
};

export default entry;
