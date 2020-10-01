import { IThunderboltEntry } from '@wix/editor-elements-types';

const entry: IThunderboltEntry = {
  loadComponent: hostAPI => {
    hostAPI.registerComponent('AddressInput', async () => {
      const componentModule = await import(
        './viewer/AddressInput' /* webpackChunkName: "AddressInput" */
      );
      return {
        component: componentModule.default,
      };
    });
  },
};

export default entry;
