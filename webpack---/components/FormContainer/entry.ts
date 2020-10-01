import { IThunderboltEntry } from '@wix/editor-elements-types';

const entry: IThunderboltEntry = {
  loadComponent: hostAPI => {
    hostAPI.registerComponent(
      'FormContainer',
      () => {
        return import(
          './viewer/FormContainerSkin/FormContainerSkin.skin' /* webpackChunkName: "FormContainer_FormContainerSkin" */
        ).then(componentModule => {
          return {
            component: componentModule.default,
          };
        });
      },
      'FormContainerSkin',
    );

    hostAPI.registerComponent(
      'FormContainer',
      () => {
        return import(
          './viewer/ResponsiveSkin/ResponsiveSkin.skin' /* webpackChunkName: "FormContainer_ResponsiveSkin" */
        ).then(componentModule => {
          return {
            component: componentModule.default,
          };
        });
      },
      'ResponsiveSkin',
    );

    /** Backward compatiability - can be removed once uiType in TB is merged */
    hostAPI.registerComponent('FormContainer', () => {
      return import(
        './viewer/FormContainerSkin/FormContainerSkin.skin' /* webpackChunkName: "FormContainerSkin" */
      ).then(componentModule => {
        return {
          component: componentModule.default,
        };
      });
    });
  },
};

export default entry;
