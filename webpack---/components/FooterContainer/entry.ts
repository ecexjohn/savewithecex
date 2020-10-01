import { IThunderboltEntry } from '@wix/editor-elements-types';

const entry: IThunderboltEntry = {
  loadComponent: hostAPI => {
    hostAPI.registerComponent(
      'FooterContainer',
      () => {
        return import(
          /* webpackChunkName: "FooterContainer_TransparentScreen" */
          './viewer/skinComps/BaseScreen/TransparentScreen.skin'
        ).then(componentModule => {
          return {
            component: componentModule.default,
          };
        });
      },
      'TransparentScreen',
    );

    hostAPI.registerComponent(
      'FooterContainer',
      () => {
        return import(
          /* webpackChunkName: "FooterContainer_DefaultScreen" */
          './viewer/skinComps/DefaultScreen/DefaultScreen.skin'
        ).then(componentModule => {
          return {
            component: componentModule.default,
          };
        });
      },
      'DefaultScreen',
    );

    hostAPI.registerComponent(
      'FooterContainer',
      () => {
        return import(
          /* webpackChunkName: "FooterContainer_WoodScreen" */
          './viewer/skinComps/BaseScreen/WoodScreen.skin'
        ).then(componentModule => {
          return {
            component: componentModule.default,
          };
        });
      },
      'WoodScreen',
    );

    hostAPI.registerComponent(
      'FooterContainer',
      () => {
        return import(
          /* webpackChunkName: "FooterContainer_LineTopScreen" */
          './viewer/skinComps/BaseScreen/LineTopScreen.skin'
        ).then(componentModule => {
          return {
            component: componentModule.default,
          };
        });
      },
      'LineTopScreen',
    );

    hostAPI.registerComponent(
      'FooterContainer',
      () => {
        return import(
          /* webpackChunkName: "FooterContainer_NoiseScreen" */
          './viewer/skinComps/BaseScreen/NoiseScreen.skin'
        ).then(componentModule => {
          return {
            component: componentModule.default,
          };
        });
      },
      'NoiseScreen',
    );

    hostAPI.registerComponent(
      'FooterContainer',
      () => {
        return import(
          /* webpackChunkName: "FooterContainer_SolidScreen" */
          './viewer/skinComps/BaseScreen/SolidScreen.skin'
        ).then(componentModule => {
          return {
            component: componentModule.default,
          };
        });
      },
      'SolidScreen',
    );

    hostAPI.registerComponent(
      'FooterContainer',
      () => {
        return import(
          /* webpackChunkName: "FooterContainer_BoxScreen" */
          './viewer/skinComps/BaseScreen/BoxScreen.skin'
        ).then(componentModule => {
          return {
            component: componentModule.default,
          };
        });
      },
      'BoxScreen',
    );

    hostAPI.registerComponent(
      'FooterContainer',
      () => {
        return import(
          /* webpackChunkName: "FooterContainer_DoubleBorderScreen" */
          './viewer/skinComps/DoubleBorderScreen/DoubleBorderScreen.skin'
        ).then(componentModule => {
          return {
            component: componentModule.default,
          };
        });
      },
      'DoubleBorderScreen',
    );
    hostAPI.registerComponent(
      'FooterContainer',
      () => {
        return import(
          /* webpackChunkName: "FooterContainer_IronScreen" */
          './viewer/skinComps/IronScreen/IronScreen.skin'
        ).then(componentModule => {
          return {
            component: componentModule.default,
          };
        });
      },
      'IronScreen',
    );

    hostAPI.registerComponent(
      'FooterContainer',
      () => {
        return import(
          /* webpackChunkName: "FooterContainer_ShadowTopScreen" */
          './viewer/skinComps/ShadowTopScreen/ShadowTopScreen.skin'
        ).then(componentModule => {
          return {
            component: componentModule.default,
          };
        });
      },
      'ShadowTopScreen',
    );

    hostAPI.registerComponent(
      'FooterContainer',
      () => {
        return import(
          /* webpackChunkName: "FooterContainer_LiftedBottomScreen" */
          './viewer/skinComps/LiftedBottomScreen/LiftedBottomScreen.skin'
        ).then(componentModule => {
          return {
            component: componentModule.default,
          };
        });
      },
      'LiftedBottomScreen',
    );

    hostAPI.registerComponent(
      'FooterContainer',
      () => {
        return import(
          /* webpackChunkName: "FooterContainer_LiftedTopScreen" */
          './viewer/skinComps/LiftedTopScreen/LiftedTopScreen.skin'
        ).then(componentModule => {
          return {
            component: componentModule.default,
          };
        });
      },
      'LiftedTopScreen',
    );

    hostAPI.registerComponent(
      'FooterContainer',
      () => {
        return import(
          /* webpackChunkName: "FooterContainer_ThreeDeeScreen" */
          './viewer/skinComps/ThreeDeeScreen/ThreeDeeScreen.skin'
        ).then(componentModule => {
          return {
            component: componentModule.default,
          };
        });
      },
      'ThreeDeeScreen',
    );

    hostAPI.registerComponent(
      'FooterContainer',
      () => {
        return import(
          /* webpackChunkName: "FooterContainer_InnerShadowScreen" */
          './viewer/skinComps/InnerShadowScreen/InnerShadowScreen.skin'
        ).then(componentModule => {
          return {
            component: componentModule.default,
          };
        });
      },
      'InnerShadowScreen',
    );

    hostAPI.registerComponent(
      'FooterContainer',
      () => {
        return import(
          /* webpackChunkName: "FooterContainer_BevelScreen" */
          './viewer/skinComps/BevelScreen/BevelScreen.skin'
        ).then(componentModule => {
          return {
            component: componentModule.default,
          };
        });
      },
      'BevelScreen',
    );

    hostAPI.registerComponent(
      'FooterContainer',
      () => {
        return import(
          /* webpackChunkName: "FooterContainer_BlankScreen" */
          './viewer/skinComps/BaseScreen/BlankScreen.skin'
        ).then(componentModule => {
          return {
            component: componentModule.default,
          };
        });
      },
      'BlankScreen',
    );
  },
};

export default entry;
