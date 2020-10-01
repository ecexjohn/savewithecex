import { IThunderboltEntry } from '@wix/editor-elements-types';

const entry: IThunderboltEntry = {
  loadComponent: hostAPI => {
    hostAPI.registerComponent(
      'Container',
      () => {
        return import(
          './viewer/AppleArea/AppleArea.skin' /* webpackChunkName: "Container_AppleArea" */
        ).then(componentModule => {
          return {
            component: componentModule.default,
          };
        });
      },
      'AppleArea',
    );
    hostAPI.registerComponent(
      'Container',
      () => {
        return import(
          './viewer/ArrowRightRibbon/ArrowRightRibbon.skin' /* webpackChunkName: "Container_ArrowRightRibbon" */
        ).then(componentModule => {
          return {
            component: componentModule.default,
          };
        });
      },
      'ArrowRightRibbon',
    );
    hostAPI.registerComponent(
      'Container',
      () => {
        return import(
          './viewer/BlankAreaSkin/BlankAreaSkin.skin' /* webpackChunkName: "Container_BlankAreaSkin" */
        ).then(componentModule => {
          return {
            component: componentModule.default,
          };
        });
      },
      'BlankAreaSkin',
    );
    hostAPI.registerComponent(
      'Container',
      () => {
        return import(
          './viewer/BorderDashDefaultAreaSkin/BorderDashDefaultAreaSkin.skin' /* webpackChunkName: "Container_BorderDashDefaultAreaSkin" */
        ).then(componentModule => {
          return {
            component: componentModule.default,
          };
        });
      },
      'BorderDashDefaultAreaSkin',
    );
    hostAPI.registerComponent(
      'Container',
      () => {
        return import(
          './viewer/CircleArea/CircleArea.skin' /* webpackChunkName: "Container_CircleArea" */
        ).then(componentModule => {
          return {
            component: componentModule.default,
          };
        });
      },
      'CircleArea',
    );
    hostAPI.registerComponent(
      'Container',
      () => {
        return import(
          './viewer/CleanZoomAreaSkin/CleanZoomAreaSkin.skin' /* webpackChunkName: "Container_CleanZoomAreaSkin" */
        ).then(componentModule => {
          return {
            component: componentModule.default,
          };
        });
      },
      'CleanZoomAreaSkin',
    );
    hostAPI.registerComponent(
      'Container',
      () => {
        return import(
          './viewer/DBDefaultAreaSkin/DBDefaultAreaSkin.skin' /* webpackChunkName: "Container_DBDefaultAreaSkin" */
        ).then(componentModule => {
          return {
            component: componentModule.default,
          };
        });
      },
      'DBDefaultAreaSkin',
    );
    hostAPI.registerComponent(
      'Container',
      () => {
        return import(
          './viewer/DefaultAreaSkin/DefaultAreaSkin.skin' /* webpackChunkName: "Container_DefaultAreaSkin" */
        ).then(componentModule => {
          return {
            component: componentModule.default,
          };
        });
      },
      'DefaultAreaSkin',
    );
    hostAPI.registerComponent(
      'Container',
      () => {
        return import(
          './viewer/GridArea/GridArea.skin' /* webpackChunkName: "Container_GridArea" */
        ).then(componentModule => {
          return {
            component: componentModule.default,
          };
        });
      },
      'GridArea',
    );
    hostAPI.registerComponent(
      'Container',
      () => {
        return import(
          './viewer/InnerMarginAreaSkin/InnerMarginAreaSkin.skin' /* webpackChunkName: "Container_InnerMarginAreaSkin" */
        ).then(componentModule => {
          return {
            component: componentModule.default,
          };
        });
      },
      'InnerMarginAreaSkin',
    );
    hostAPI.registerComponent(
      'Container',
      () => {
        return import(
          './viewer/InnerShadowAreaSkin/InnerShadowAreaSkin.skin' /* webpackChunkName: "Container_InnerShadowAreaSkin" */
        ).then(componentModule => {
          return {
            component: componentModule.default,
          };
        });
      },
      'InnerShadowAreaSkin',
    );
    hostAPI.registerComponent(
      'Container',
      () => {
        return import(
          './viewer/LinesAreaSkin/LinesAreaSkin.skin' /* webpackChunkName: "Container_LinesAreaSkin" */
        ).then(componentModule => {
          return {
            component: componentModule.default,
          };
        });
      },
      'LinesAreaSkin',
    );
    hostAPI.registerComponent(
      'Container',
      () => {
        return import(
          './viewer/RectangleArea/RectangleArea.skin' /* webpackChunkName: "Container_RectangleArea" */
        ).then(componentModule => {
          return {
            component: componentModule.default,
          };
        });
      },
      'RectangleArea',
    );
    hostAPI.registerComponent(
      'Container',
      () => {
        return import(
          './viewer/RectangleAreaAfterScroll/RectangleAreaAfterScroll.skin' /* webpackChunkName: "Container_RectangleAreaAfterScroll" */
        ).then(componentModule => {
          return {
            component: componentModule.default,
          };
        });
      },
      'RectangleAreaAfterScroll',
    );
    hostAPI.registerComponent(
      'Container',
      () => {
        return import(
          './viewer/RoundArea/RoundArea.skin' /* webpackChunkName: "Container_RoundArea" */
        ).then(componentModule => {
          return {
            component: componentModule.default,
          };
        });
      },
      'RoundArea',
    );
    hostAPI.registerComponent(
      'Container',
      () => {
        return import(
          './viewer/RoundShadowArea/RoundShadowArea.skin' /* webpackChunkName: "Container_RoundShadowArea" */
        ).then(componentModule => {
          return {
            component: componentModule.default,
          };
        });
      },
      'RoundShadowArea',
    );
    hostAPI.registerComponent(
      'Container',
      () => {
        return import(
          './viewer/ThreeDeeAreaSkin/ThreeDeeAreaSkin.skin' /* webpackChunkName: "Container_ThreeDeeAreaSkin" */
        ).then(componentModule => {
          return {
            component: componentModule.default,
          };
        });
      },
      'ThreeDeeAreaSkin',
    );
    hostAPI.registerComponent(
      'Container',
      () => {
        return import(
          './viewer/TiltedAreaSkin/TiltedAreaSkin.skin' /* webpackChunkName: "Container_TiltedAreaSkin" */
        ).then(componentModule => {
          return {
            component: componentModule.default,
          };
        });
      },
      'TiltedAreaSkin',
    );
    hostAPI.registerComponent(
      'Container',
      () => {
        return import(
          './viewer/TransparentArea/TransparentArea.skin' /* webpackChunkName: "Container_TransparentArea" */
        ).then(componentModule => {
          return {
            component: componentModule.default,
          };
        });
      },
      'TransparentArea',
    );
    hostAPI.registerComponent(
      'Container',
      () => {
        return import(
          './viewer/WrapperSkin/WrapperSkin.skin' /* webpackChunkName: "Container_WrapperSkin" */
        ).then(componentModule => {
          return {
            component: componentModule.default,
          };
        });
      },
      'WrapperSkin',
    );
    hostAPI.registerComponent(
      'Container',
      () => {
        return import(
          './viewer/BubbleArea/BubbleArea.skin' /* webpackChunkName: "Container_BubbleArea" */
        ).then(componentModule => {
          return {
            component: componentModule.default,
          };
        });
      },
      'BubbleArea',
    );
    hostAPI.registerComponent(
      'Container',
      () => {
        return import(
          './viewer/BubbleAreaLeft/BubbleAreaLeft.skin' /* webpackChunkName: "Container_BubbleAreaLeft" */
        ).then(componentModule => {
          return {
            component: componentModule.default,
          };
        });
      },
      'BubbleAreaLeft',
    );
    hostAPI.registerComponent(
      'Container',
      () => {
        return import(
          './viewer/BubbleAreaRight/BubbleAreaRight.skin' /* webpackChunkName: "Container_BubbleAreaRight" */
        ).then(componentModule => {
          return {
            component: componentModule.default,
          };
        });
      },
      'BubbleAreaRight',
    );
    hostAPI.registerComponent(
      'Container',
      () => {
        return import(
          './viewer/BubbleLeftArea/BubbleLeftArea.skin' /* webpackChunkName: "Container_BubbleLeftArea" */
        ).then(componentModule => {
          return {
            component: componentModule.default,
          };
        });
      },
      'BubbleLeftArea',
    );
    hostAPI.registerComponent(
      'Container',
      () => {
        return import(
          './viewer/LeftTriangleArea/LeftTriangleArea.skin' /* webpackChunkName: "Container_LeftTriangleArea" */
        ).then(componentModule => {
          return {
            component: componentModule.default,
          };
        });
      },
      'LeftTriangleArea',
    );
    hostAPI.registerComponent(
      'Container',
      () => {
        return import(
          './viewer/RightTriangleArea/RightTriangleArea.skin' /* webpackChunkName: "Container_RightTriangleArea" */
        ).then(componentModule => {
          return {
            component: componentModule.default,
          };
        });
      },
      'RightTriangleArea',
    );
    hostAPI.registerComponent(
      'Container',
      () => {
        return import(
          './viewer/ScotchDoubleHorizontalArea/ScotchDoubleHorizontalArea.skin' /* webpackChunkName: "Container_ScotchDoubleHorizontalArea" */
        ).then(componentModule => {
          return {
            component: componentModule.default,
          };
        });
      },
      'ScotchDoubleHorizontalArea',
    );
    hostAPI.registerComponent(
      'Container',
      () => {
        return import(
          './viewer/ScotchDoubleVerticalArea/ScotchDoubleVerticalArea.skin' /* webpackChunkName: "Container_ScotchDoubleVerticalArea" */
        ).then(componentModule => {
          return {
            component: componentModule.default,
          };
        });
      },
      'ScotchDoubleVerticalArea',
    );
    hostAPI.registerComponent(
      'Container',
      () => {
        return import(
          './viewer/ScotchTopArea/ScotchTopArea.skin' /* webpackChunkName: "Container_ScotchTopArea" */
        ).then(componentModule => {
          return {
            component: componentModule.default,
          };
        });
      },
      'ScotchTopArea',
    );
    hostAPI.registerComponent(
      'Container',
      () => {
        return import(
          './viewer/CenterRibbon/CenterRibbon.skin' /* webpackChunkName: "Container_CenterRibbon" */
        ).then(componentModule => {
          return {
            component: componentModule.default,
          };
        });
      },
      'CenterRibbon',
    );
    hostAPI.registerComponent(
      'Container',
      () => {
        return import(
          './viewer/CustomRibbonArea/CustomRibbonArea.skin' /* webpackChunkName: "Container_CustomRibbonArea" */
        ).then(componentModule => {
          return {
            component: componentModule.default,
          };
        });
      },
      'CustomRibbonArea',
    );
    hostAPI.registerComponent(
      'Container',
      () => {
        return import(
          './viewer/ForkedRibbonArea/ForkedRibbonArea.skin' /* webpackChunkName: "Container_ForkedRibbonArea" */
        ).then(componentModule => {
          return {
            component: componentModule.default,
          };
        });
      },
      'ForkedRibbonArea',
    );
    hostAPI.registerComponent(
      'Container',
      () => {
        return import(
          './viewer/ForkedRightRibbon/ForkedRightRibbon.skin' /* webpackChunkName: "Container_ForkedRightRibbon" */
        ).then(componentModule => {
          return {
            component: componentModule.default,
          };
        });
      },
      'ForkedRightRibbon',
    );
    hostAPI.registerComponent(
      'Container',
      () => {
        return import(
          './viewer/ResponsiveBox/ResponsiveBox' /* webpackChunkName: "Container_ResponsiveBox" */
        ).then(componentModule => {
          return {
            component: componentModule.default,
          };
        });
      },
      'ResponsiveBox',
    );
    hostAPI.registerComponent(
      'Container',
      () => {
        return import(
          './viewer/IronBox/IronBox.skin' /* webpackChunkName: "Container_IronBox" */
        ).then(componentModule => {
          return {
            component: componentModule.default,
          };
        });
      },
      'IronBox',
    );
    hostAPI.registerComponent(
      'Container',
      () => {
        return import(
          './viewer/LiftedBottomAreaSkin/LiftedBottomAreaSkin.skin' /* webpackChunkName: "Container_LiftedBottomAreaSkin" */
        ).then(componentModule => {
          return {
            component: componentModule.default,
          };
        });
      },
      'LiftedBottomAreaSkin',
    );
    hostAPI.registerComponent(
      'Container',
      () => {
        return import(
          './viewer/LiftedShadowArea/LiftedShadowArea.skin' /* webpackChunkName: "Container_LiftedShadowArea" */
        ).then(componentModule => {
          return {
            component: componentModule.default,
          };
        });
      },
      'LiftedShadowArea',
    );
    hostAPI.registerComponent(
      'Container',
      () => {
        return import(
          './viewer/LiftedTopAreaSkin/LiftedTopAreaSkin.skin' /* webpackChunkName: "Container_LiftedTopAreaSkin" */
        ).then(componentModule => {
          return {
            component: componentModule.default,
          };
        });
      },
      'LiftedTopAreaSkin',
    );
    hostAPI.registerComponent(
      'Container',
      () => {
        return import(
          './viewer/PhotoArea/PhotoArea.skin' /* webpackChunkName: "Container_PhotoArea" */
        ).then(componentModule => {
          return {
            component: componentModule.default,
          };
        });
      },
      'PhotoArea',
    );
    hostAPI.registerComponent(
      'Container',
      () => {
        return import(
          './viewer/RibbonAreaSkin/RibbonAreaSkin.skin' /* webpackChunkName: "Container_RibbonAreaSkin" */
        ).then(componentModule => {
          return {
            component: componentModule.default,
          };
        });
      },
      'RibbonAreaSkin',
    );
    hostAPI.registerComponent(
      'Container',
      () => {
        return import(
          './viewer/SandClockArea/SandClockArea.skin' /* webpackChunkName: "Container_SandClockArea" */
        ).then(componentModule => {
          return {
            component: componentModule.default,
          };
        });
      },
      'SandClockArea',
    );
    hostAPI.registerComponent(
      'Container',
      () => {
        return import(
          './viewer/SloopyArea/SloopyArea.skin' /* webpackChunkName: "Container_SloopyArea" */
        ).then(componentModule => {
          return {
            component: componentModule.default,
          };
        });
      },
      'SloopyArea',
    );
    hostAPI.registerComponent(
      'Container',
      () => {
        return import(
          './viewer/VerticalArrowArea/VerticalArrowArea.skin' /* webpackChunkName: "Container_VerticalArrowArea" */
        ).then(componentModule => {
          return {
            component: componentModule.default,
          };
        });
      },
      'VerticalArrowArea',
    );
    hostAPI.registerComponent(
      'Container',
      () => {
        return import(
          './viewer/VerticalRibbonArea/VerticalRibbonArea.skin' /* webpackChunkName: "Container_VerticalRibbonArea" */
        ).then(componentModule => {
          return {
            component: componentModule.default,
          };
        });
      },
      'VerticalRibbonArea',
    );
    // fallback for previous "thunderbolt-core-components" and for non implemented skins
    hostAPI.registerComponent('Container', () => {
      return import(
        './viewer/NoSkin/NoSkin.skin' /* webpackChunkName: "Container" */
      ).then(componentModule => {
        return {
          component: componentModule.default,
        };
      });
    });
  },
};

export default entry;
