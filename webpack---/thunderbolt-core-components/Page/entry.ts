import { IThunderboltEntry } from '@wix/editor-elements-types';

const entry: IThunderboltEntry = {
  loadComponent: hostAPI => {
    hostAPI.registerComponent(
      'Page',
      () => {
        return import(
          './viewer/skinComps/ThreeDee/ThreeDee.skin' /* webpackChunkName: "Page_ThreeDeePageSkin" */
        ).then(componentModule => {
          return {
            component: componentModule.default,
          };
        });
      },
      'ThreeDeePageSkin',
    );

    hostAPI.registerComponent(
      'Page',
      () => {
        return import(
          './viewer/skinComps/Sloopy/Sloopy.skin' /* webpackChunkName: "Page_SloopyPageSkin" */
        ).then(componentModule => {
          return {
            component: componentModule.default,
          };
        });
      },
      'SloopyPageSkin',
    );

    hostAPI.registerComponent(
      'Page',
      () => {
        return import(
          './viewer/skinComps/LiftedTop/LiftedTop.skin' /* webpackChunkName: "Page_LiftedTopPageSkin" */
        ).then(componentModule => {
          return {
            component: componentModule.default,
          };
        });
      },
      'LiftedTopPageSkin',
    );

    hostAPI.registerComponent(
      'Page',
      () => {
        return import(
          './viewer/skinComps/LiftedShadow/LiftedShadow.skin' /* webpackChunkName: "Page_LiftedShadowPageSkin" */
        ).then(componentModule => {
          return {
            component: componentModule.default,
          };
        });
      },
      'LiftedShadowPageSkin',
    );

    hostAPI.registerComponent(
      'Page',
      () => {
        return import(
          './viewer/skinComps/LiftedBottom/LiftedBottom.skin' /* webpackChunkName: "Page_LiftedBottomPageSkin" */
        ).then(componentModule => {
          return {
            component: componentModule.default,
          };
        });
      },
      'LiftedBottomPageSkin',
    );

    hostAPI.registerComponent(
      'Page',
      () => {
        return import(
          './viewer/skinComps/BasePage/BasicPage.skin' /* webpackChunkName: "Page_BasicPageSkin" */
        ).then(componentModule => {
          return {
            component: componentModule.default,
          };
        });
      },
      'BasicPageSkin',
    );

    hostAPI.registerComponent(
      'Page',
      () => {
        return import(
          './viewer/skinComps/BasePage/BorderPage.skin' /* webpackChunkName: "Page_BorderPageSkin" */
        ).then(componentModule => {
          return {
            component: componentModule.default,
          };
        });
      },
      'BorderPageSkin',
    );

    hostAPI.registerComponent(
      'Page',
      () => {
        return import(
          './viewer/skinComps/BasePage/InnerShadowPage.skin' /* webpackChunkName: "Page_InnerShadowPageSkin" */
        ).then(componentModule => {
          return {
            component: componentModule.default,
          };
        });
      },
      'InnerShadowPageSkin',
    );

    hostAPI.registerComponent(
      'Page',
      () => {
        return import(
          './viewer/skinComps/BasePage/NoMarginPage.skin' /* webpackChunkName: "Page_NoMarginPageSkin" */
        ).then(componentModule => {
          return {
            component: componentModule.default,
          };
        });
      },
      'NoMarginPageSkin',
    );

    hostAPI.registerComponent(
      'Page',
      () => {
        return import(
          './viewer/skinComps/BasePage/ShinyIPage.skin' /* webpackChunkName: "Page_ShinyIPageSkin" */
        ).then(componentModule => {
          return {
            component: componentModule.default,
          };
        });
      },
      'ShinyIPageSkin',
    );

    hostAPI.registerComponent(
      'Page',
      () => {
        return import(
          './viewer/skinComps/BasePage/TransparentPage.skin' /* webpackChunkName: "Page_TransparentPageSkin" */
        ).then(componentModule => {
          return {
            component: componentModule.default,
          };
        });
      },
      'TransparentPageSkin',
    );

    hostAPI.registerComponent(
      'Page',
      () => {
        return import(
          './viewer/skinComps/Responsive/ResponsivePageWithColorBG.skin' /* webpackChunkName: "Page_ResponsivePageWithColorBG" */
        ).then(componentModule => {
          return {
            component: componentModule.default,
          };
        });
      },
      'ResponsivePageWithColorBG',
    );

    hostAPI.registerComponent(
      'Page',
      () => {
        return import(
          './viewer/skinComps/VerySimple/VerySimple.skin' /* webpackChunkName: "Page_VerySimpleSkin" */
        ).then(componentModule => {
          return {
            component: componentModule.default,
          };
        });
      },
      'VerySimpleSkin',
    );
  },
};

export default entry;
