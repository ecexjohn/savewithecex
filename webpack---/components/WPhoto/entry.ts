import { IThunderboltEntry } from '@wix/editor-elements-types';

const entry: IThunderboltEntry = {
  loadComponent: hostAPI => {
    // TODO - remove this default skin after TB uiType PR is merged
    hostAPI.registerComponent('WPhoto', () => {
      return import(
        './viewer/skinComps/BasicWPhoto/ClipArt.skin' /* webpackChunkName: "WPhoto" */
      ).then(componentModule => {
        return {
          component: componentModule.default,
        };
      });
    });
    hostAPI.registerComponent(
      'WPhoto',
      () => {
        return import(
          './viewer/skinComps/BasicWPhoto/ClipArt.skin' /* webpackChunkName: "WPhoto_ClipArtSkin" */
        ).then(componentModule => {
          return {
            component: componentModule.default,
          };
        });
      },
      'ClipArtSkin',
    );
    hostAPI.registerComponent(
      'WPhoto',
      () => {
        return import(
          './viewer/skinComps/BasicWPhoto/CirclePhoto.skin' /* webpackChunkName: "WPhoto_CirclePhoto" */
        ).then(componentModule => {
          return {
            component: componentModule.default,
          };
        });
      },
      'CirclePhoto',
    );
    hostAPI.registerComponent(
      'WPhoto',
      () => {
        return import(
          './viewer/skinComps/BasicWPhoto/DefaultPhoto.skin' /* webpackChunkName: "WPhoto_DefaultPhoto" */
        ).then(componentModule => {
          return {
            component: componentModule.default,
          };
        });
      },
      'DefaultPhoto',
    );
    hostAPI.registerComponent(
      'WPhoto',
      () => {
        return import(
          './viewer/skinComps/BasicWPhoto/DoubleBorderCirclePhoto.skin' /* webpackChunkName: "WPhoto_DoubleBorderCirclePhoto" */
        ).then(componentModule => {
          return {
            component: componentModule.default,
          };
        });
      },
      'DoubleBorderCirclePhoto',
    );
    hostAPI.registerComponent(
      'WPhoto',
      () => {
        return import(
          './viewer/skinComps/BasicWPhoto/DoubleBorderPhoto.skin' /* webpackChunkName: "WPhoto_DoubleBorderPhoto" */
        ).then(componentModule => {
          return {
            component: componentModule.default,
          };
        });
      },
      'DoubleBorderPhoto',
    );
    hostAPI.registerComponent(
      'WPhoto',
      () => {
        return import(
          './viewer/skinComps/BasicWPhoto/GlowLinePhoto.skin' /* webpackChunkName: "WPhoto_GlowLinePhoto" */
        ).then(componentModule => {
          return {
            component: componentModule.default,
          };
        });
      },
      'GlowLinePhoto',
    );
    hostAPI.registerComponent(
      'WPhoto',
      () => {
        return import(
          './viewer/skinComps/IronPhoto/IronPhoto.skin' /* webpackChunkName: "WPhoto_IronPhoto" */
        ).then(componentModule => {
          return {
            component: componentModule.default,
          };
        });
      },
      'IronPhoto',
    );
    hostAPI.registerComponent(
      'WPhoto',
      () => {
        return import(
          './viewer/skinComps/BasicWPhoto/LiftedShadowPhoto.skin' /* webpackChunkName: "WPhoto_LiftedShadowPhoto" */
        ).then(componentModule => {
          return {
            component: componentModule.default,
          };
        });
      },
      'LiftedShadowPhoto',
    );
    hostAPI.registerComponent(
      'WPhoto',
      () => {
        return import(
          './viewer/skinComps/BasicWPhoto/LiftedTopPhoto.skin' /* webpackChunkName: "WPhoto_LiftedTopPhoto" */
        ).then(componentModule => {
          return {
            component: componentModule.default,
          };
        });
      },
      'LiftedTopPhoto',
    );
    hostAPI.registerComponent(
      'WPhoto',
      () => {
        return import(
          './viewer/skinComps/BasicWPhoto/MouseOverPhoto.skin' /* webpackChunkName: "WPhoto_MouseOverPhoto" */
        ).then(componentModule => {
          return {
            component: componentModule.default,
          };
        });
      },
      'MouseOverPhoto',
    );
    hostAPI.registerComponent(
      'WPhoto',
      () => {
        return import(
          './viewer/skinComps/NewPolaroidPhoto/NewPolaroidPhoto.skin' /* webpackChunkName: "WPhoto_NewPolaroidPhoto" */
        ).then(componentModule => {
          return {
            component: componentModule.default,
          };
        });
      },
      'NewPolaroidPhoto',
    );
    hostAPI.registerComponent(
      'WPhoto',
      () => {
        return import(
          './viewer/skinComps/BasicWPhoto/NoSkinPhoto.skin' /* webpackChunkName: "WPhoto_NoSkinPhoto" */
        ).then(componentModule => {
          return {
            component: componentModule.default,
          };
        });
      },
      'NoSkinPhoto',
    );
    hostAPI.registerComponent(
      'WPhoto',
      () => {
        return import(
          './viewer/skinComps/PaperclipPhoto/PaperclipPhoto.skin' /* webpackChunkName: "WPhoto_PaperclipPhoto" */
        ).then(componentModule => {
          return {
            component: componentModule.default,
          };
        });
      },
      'PaperclipPhoto',
    );
    hostAPI.registerComponent(
      'WPhoto',
      () => {
        return import(
          './viewer/skinComps/BasicWPhoto/PolaroidPhoto.skin' /* webpackChunkName: "WPhoto_PolaroidPhoto" */
        ).then(componentModule => {
          return {
            component: componentModule.default,
          };
        });
      },
      'PolaroidPhoto',
    );
    hostAPI.registerComponent(
      'WPhoto',
      () => {
        return import(
          './viewer/skinComps/BasicWPhoto/RoundPhoto.skin' /* webpackChunkName: "WPhoto_RoundPhoto" */
        ).then(componentModule => {
          return {
            component: componentModule.default,
          };
        });
      },
      'RoundPhoto',
    );
    hostAPI.registerComponent(
      'WPhoto',
      () => {
        return import(
          './viewer/skinComps/BasicWPhoto/RoundShadowPhoto.skin' /* webpackChunkName: "WPhoto_RoundShadowPhoto" */
        ).then(componentModule => {
          return {
            component: componentModule.default,
          };
        });
      },
      'RoundShadowPhoto',
    );
    hostAPI.registerComponent(
      'WPhoto',
      () => {
        return import(
          './viewer/skinComps/ScotchDouble/ScotchDoubleHorizontal.skin' /* webpackChunkName: "WPhoto_ScotchDoubleHorizontal" */
        ).then(componentModule => {
          return {
            component: componentModule.default,
          };
        });
      },
      'ScotchDoubleHorizontal',
    );
    hostAPI.registerComponent(
      'WPhoto',
      () => {
        return import(
          './viewer/skinComps/ScotchDouble/ScotchDoubleVertical.skin' /* webpackChunkName: "WPhoto_ScotchDoubleVertical" */
        ).then(componentModule => {
          return {
            component: componentModule.default,
          };
        });
      },
      'ScotchDoubleVertical',
    );
    hostAPI.registerComponent(
      'WPhoto',
      () => {
        return import(
          './viewer/skinComps/BasicWPhoto/ScotchTopPhoto.skin' /* webpackChunkName: "WPhoto_ScotchTopPhoto" */
        ).then(componentModule => {
          return {
            component: componentModule.default,
          };
        });
      },
      'ScotchTopPhoto',
    );
    hostAPI.registerComponent(
      'WPhoto',
      () => {
        return import(
          './viewer/skinComps/ScotchTapePhoto/ScotchTapePhoto.skin' /* webpackChunkName: "WPhoto_ScotchTapePhoto" */
        ).then(componentModule => {
          return {
            component: componentModule.default,
          };
        });
      },
      'ScotchTapePhoto',
    );
    hostAPI.registerComponent(
      'WPhoto',
      () => {
        return import(
          './viewer/skinComps/SloppyPhoto/SloppyPhoto.skin' /* webpackChunkName: "WPhoto_SloppyPhoto" */
        ).then(componentModule => {
          return {
            component: componentModule.default,
          };
        });
      },
      'SloppyPhoto',
    );
    hostAPI.registerComponent(
      'WPhoto',
      () => {
        return import(
          './viewer/skinComps/VintagePhoto/VintagePhoto.skin' /* webpackChunkName: "WPhoto_VintagePhoto" */
        ).then(componentModule => {
          return {
            component: componentModule.default,
          };
        });
      },
      'VintagePhoto',
    );
  },
};

export default entry;
