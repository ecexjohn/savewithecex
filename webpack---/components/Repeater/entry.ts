import { IThunderboltEntry } from '@wix/editor-elements-types';

const entry: IThunderboltEntry = {
  loadComponent: hostAPI => {
    hostAPI.registerComponent(
      'Repeater',
      () => {
        return import(
          './viewer/ResponsiveRepeater' /* webpackChunkName: "Repeater_Responsive" */
        ).then(componentModule => {
          return {
            component: componentModule.default,
          };
        });
      },
      'Responsive',
    );
  },
};

export default entry;
