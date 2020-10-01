import { IThunderboltEntry } from '@wix/editor-elements-types';

const entry: IThunderboltEntry = {
  loadComponent: hostAPI => {
    hostAPI.registerComponent(
      'MenuContainer',
      () => {
        return import(
          './viewer/MenuContainer' /* webpackChunkName: "MenuContainer_Classic" */
        ).then(componentModule => {
          return {
            component: componentModule.default,
          };
        });
      },
      'Classic',
    );

    hostAPI.registerComponent('MenuContainer', () => {
      return import(
        './viewer/MenuContainer' /* webpackChunkName: "MenuContainer" */
      ).then(componentModule => {
        return {
          component: componentModule.default,
        };
      });
    });

    hostAPI.registerComponent(
      'MenuContainer',
      () => {
        return import(
          './viewer/ResponsiveMenuContainer' /* webpackChunkName: "MenuContainer_Responsive" */
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
