import { IThunderboltEntry } from '@wix/editor-elements-types';

const entry: IThunderboltEntry = {
  loadComponent: hostAPI => {
    hostAPI.registerComponent(
      'HeaderContainer',
      () => {
        return import(
          /* webpackChunkName: "HeaderContainer_TransparentScreen" */
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
      'HeaderContainer',
      () => {
        return import(
          /* webpackChunkName: "HeaderContainer_DefaultScreen" */
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
      'HeaderContainer',
      () => {
        return import(
          /* webpackChunkName: "HeaderContainer_WoodScreen" */
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
      'HeaderContainer',
      () => {
        return import(
          /* webpackChunkName: "HeaderContainer_LineBottomScreen" */
          './viewer/skinComps/BaseScreen/LineBottomScreen.skin'
        ).then(componentModule => {
          return {
            component: componentModule.default,
          };
        });
      },
      'LineBottomScreen',
    );

    hostAPI.registerComponent(
      'HeaderContainer',
      () => {
        return import(
          /* webpackChunkName: "HeaderContainer_NoiseScreen" */
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
      'HeaderContainer',
      () => {
        return import(
          /* webpackChunkName: "HeaderContainer_SolidScreen" */
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
      'HeaderContainer',
      () => {
        return import(
          /* webpackChunkName: "HeaderContainer_BoxScreen" */
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
      'HeaderContainer',
      () => {
        return import(
          /* webpackChunkName: "HeaderContainer_DoubleBorderScreen" */
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
      'HeaderContainer',
      () => {
        return import(
          /* webpackChunkName: "HeaderContainer_IronScreen" */
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
      'HeaderContainer',
      () => {
        return import(
          /* webpackChunkName: "HeaderContainer_ShadowBottomScreen" */
          './viewer/skinComps/ShadowBottomScreen/ShadowBottomScreen.skin'
        ).then(componentModule => {
          return {
            component: componentModule.default,
          };
        });
      },
      'ShadowBottomScreen',
    );

    hostAPI.registerComponent(
      'HeaderContainer',
      () => {
        return import(
          /* webpackChunkName: "HeaderContainer_LiftedBottomScreen" */
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
      'HeaderContainer',
      () => {
        return import(
          /* webpackChunkName: "HeaderContainer_LiftedTopScreen" */
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
      'HeaderContainer',
      () => {
        return import(
          /* webpackChunkName: "HeaderContainer_ThreeDeeScreen" */
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
      'HeaderContainer',
      () => {
        return import(
          /* webpackChunkName: "HeaderContainer_InnerShadowScreen" */
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
      'HeaderContainer',
      () => {
        return import(
          /* webpackChunkName: "HeaderContainer_BevelScreen" */
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
      'HeaderContainer',
      () => {
        return import(
          /* webpackChunkName: "HeaderContainer_BlankScreen" */
          './viewer/skinComps/BaseScreen/BlankScreen.skin'
        ).then(componentModule => {
          return {
            component: componentModule.default,
          };
        });
      },
      'BlankScreen',
    );

    hostAPI.registerComponent(
      'HeaderContainer',
      () => {
        return import(
          /* webpackChunkName: "HeaderContainer_AfterScroll" */
          './viewer/skinComps/AfterScroll/AfterScroll.skin'
        ).then(componentModule => {
          return {
            component: componentModule.default,
          };
        });
      },
      'AfterScroll',
    );
  },
};

export default entry;
