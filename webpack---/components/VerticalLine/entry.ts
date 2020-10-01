import { IThunderboltEntry } from '@wix/editor-elements-types';

const entry: IThunderboltEntry = {
  loadComponent: hostAPI => {
    hostAPI.registerComponent(
      'VerticalLine',
      () => {
        return import(
          './viewer/skinComps/BaseVerticalLine/VerticalArrowLine.skin' /* webpackChunkName: "VerticalLine_VerticalArrowLine" */
        ).then(componentModule => {
          return {
            component: componentModule.default,
          };
        });
      },
      'VerticalArrowLine',
    );

    hostAPI.registerComponent(
      'VerticalLine',
      () => {
        return import(
          './viewer/skinComps/BaseVerticalLine/VerticalArrowLineTop.skin' /* webpackChunkName: "VerticalLine_VerticalArrowLineTop" */
        ).then(componentModule => {
          return {
            component: componentModule.default,
          };
        });
      },
      'VerticalArrowLineTop',
    );

    hostAPI.registerComponent(
      'VerticalLine',
      () => {
        return import(
          './viewer/skinComps/BaseVerticalLine/VerticalDashedLine.skin' /* webpackChunkName: "VerticalLine_VerticalDashedLine" */
        ).then(componentModule => {
          return {
            component: componentModule.default,
          };
        });
      },
      'VerticalDashedLine',
    );

    hostAPI.registerComponent(
      'VerticalLine',
      () => {
        return import(
          './viewer/skinComps/BaseVerticalLine/VerticalDottedLine.skin' /* webpackChunkName: "VerticalLine_VerticalDottedLine" */
        ).then(componentModule => {
          return {
            component: componentModule.default,
          };
        });
      },
      'VerticalDottedLine',
    );

    hostAPI.registerComponent(
      'VerticalLine',
      () => {
        return import(
          './viewer/skinComps/BaseVerticalLine/VerticalDoubleLine.skin' /* webpackChunkName: "VerticalLine_VerticalDoubleLine" */
        ).then(componentModule => {
          return {
            component: componentModule.default,
          };
        });
      },
      'VerticalDoubleLine',
    );

    hostAPI.registerComponent(
      'VerticalLine',
      () => {
        return import(
          './viewer/skinComps/BaseVerticalLine/VerticalFadeNotchLeftLine.skin' /* webpackChunkName: "VerticalLine_VerticalFadeNotchLeftLine" */
        ).then(componentModule => {
          return {
            component: componentModule.default,
          };
        });
      },
      'VerticalFadeNotchLeftLine',
    );

    hostAPI.registerComponent(
      'VerticalLine',
      () => {
        return import(
          './viewer/skinComps/BaseVerticalLine/VerticalFadeNotchRightLine.skin' /* webpackChunkName: "VerticalLine_VerticalFadeNotchRightLine" */
        ).then(componentModule => {
          return {
            component: componentModule.default,
          };
        });
      },
      'VerticalFadeNotchRightLine',
    );

    hostAPI.registerComponent(
      'VerticalLine',
      () => {
        return import(
          './viewer/skinComps/BaseVerticalLine/VerticalIronLine.skin' /* webpackChunkName: "VerticalLine_VerticalIronLine" */
        ).then(componentModule => {
          return {
            component: componentModule.default,
          };
        });
      },
      'VerticalIronLine',
    );

    hostAPI.registerComponent(
      'VerticalLine',
      () => {
        return import(
          './viewer/skinComps/BaseVerticalLine/VerticalNotchDashedLine.skin' /* webpackChunkName: "VerticalLine_VerticalNotchDashedLine" */
        ).then(componentModule => {
          return {
            component: componentModule.default,
          };
        });
      },
      'VerticalNotchDashedLine',
    );

    hostAPI.registerComponent(
      'VerticalLine',
      () => {
        return import(
          './viewer/skinComps/BaseVerticalLine/VerticalNotchLine.skin' /* webpackChunkName: "VerticalLine_VerticalNotchLine" */
        ).then(componentModule => {
          return {
            component: componentModule.default,
          };
        });
      },
      'VerticalNotchLine',
    );

    hostAPI.registerComponent(
      'VerticalLine',
      () => {
        return import(
          './viewer/skinComps/BaseVerticalLine/VerticalShadowLeftLine.skin' /* webpackChunkName: "VerticalLine_VerticalShadowLeftLine" */
        ).then(componentModule => {
          return {
            component: componentModule.default,
          };
        });
      },
      'VerticalShadowLeftLine',
    );

    hostAPI.registerComponent(
      'VerticalLine',
      () => {
        return import(
          './viewer/skinComps/BaseVerticalLine/VerticalShadowRightLine.skin' /* webpackChunkName: "VerticalLine_VerticalShadowRightLine" */
        ).then(componentModule => {
          return {
            component: componentModule.default,
          };
        });
      },
      'VerticalShadowRightLine',
    );

    hostAPI.registerComponent(
      'VerticalLine',
      () => {
        return import(
          './viewer/skinComps/BaseVerticalLine/VerticalSloopyLine.skin' /* webpackChunkName: "VerticalLine_VerticalSloopyLine" */
        ).then(componentModule => {
          return {
            component: componentModule.default,
          };
        });
      },
      'VerticalSloopyLine',
    );

    hostAPI.registerComponent(
      'VerticalLine',
      () => {
        return import(
          './viewer/skinComps/BaseVerticalLine/VerticalSolidLine.skin' /* webpackChunkName: "VerticalLine_VerticalSolidLine" */
        ).then(componentModule => {
          return {
            component: componentModule.default,
          };
        });
      },
      'VerticalSolidLine',
    );

    hostAPI.registerComponent(
      'VerticalLine',
      () => {
        return import(
          './viewer/skinComps/VerticalLineSkin/VerticalLineSkin' /* webpackChunkName: "VerticalLine_VerticalLineSkin" */
        ).then(componentModule => {
          return {
            component: componentModule.default,
          };
        });
      },
      'VerticalLineSkin',
    );
  },
};

export default entry;
