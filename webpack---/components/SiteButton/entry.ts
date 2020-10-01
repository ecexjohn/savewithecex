import { IThunderboltEntry } from '@wix/editor-elements-types';

const entry: IThunderboltEntry = {
  loadComponent: hostAPI => {
    hostAPI.registerComponent(
      'SiteButton',
      () => {
        return import(
          './viewer/skinComps/BaseButton/BasicButton.skin' /* webpackChunkName: "SiteButton_BasicButton" */
        ).then(componentModule => {
          return {
            component: componentModule.default,
          };
        });
      },
      'BasicButton',
    );

    hostAPI.registerComponent(
      'SiteButton',
      () => {
        return import(
          './viewer/skinComps/BaseButton/TextOnlyButtonSkin.skin' /* webpackChunkName: "SiteButton_TextOnlyButtonSkin" */
        ).then(componentModule => {
          return {
            component: componentModule.default,
          };
        });
      },
      'TextOnlyButtonSkin',
    );

    hostAPI.registerComponent(
      'SiteButton',
      () => {
        return import(
          './viewer/skinComps/BaseButton/AddProductButton.skin' /* webpackChunkName: "SiteButton_AddProductButton" */
        ).then(componentModule => {
          return {
            component: componentModule.default,
          };
        });
      },
      'AddProductButton',
    );

    hostAPI.registerComponent(
      'SiteButton',
      () => {
        return import(
          './viewer/skinComps/BaseButton/ApplyButtonEcom.skin' /* webpackChunkName: "SiteButton_ApplyButtonEcom" */
        ).then(componentModule => {
          return {
            component: componentModule.default,
          };
        });
      },
      'ApplyButtonEcom',
    );

    hostAPI.registerComponent(
      'SiteButton',
      () => {
        return import(
          './viewer/skinComps/BaseButton/BorderButton.skin' /* webpackChunkName: "SiteButton_BorderButton" */
        ).then(componentModule => {
          return {
            component: componentModule.default,
          };
        });
      },
      'BorderButton',
    );

    hostAPI.registerComponent(
      'SiteButton',
      () => {
        return import(
          './viewer/skinComps/BaseButton/BrandButton.skin' /* webpackChunkName: "SiteButton_BrandButton" */
        ).then(componentModule => {
          return {
            component: componentModule.default,
          };
        });
      },
      'BrandButton',
    );

    hostAPI.registerComponent(
      'SiteButton',
      () => {
        return import(
          './viewer/skinComps/BaseButton/ButtonInnerShadow.skin' /* webpackChunkName: "SiteButton_ButtonInnerShadow" */
        ).then(componentModule => {
          return {
            component: componentModule.default,
          };
        });
      },
      'ButtonInnerShadow',
    );

    hostAPI.registerComponent(
      'SiteButton',
      () => {
        return import(
          './viewer/skinComps/BaseButton/ButtonShadowLeft.skin' /* webpackChunkName: "SiteButton_ButtonShadowLeft" */
        ).then(componentModule => {
          return {
            component: componentModule.default,
          };
        });
      },
      'ButtonShadowLeft',
    );

    hostAPI.registerComponent(
      'SiteButton',
      () => {
        return import(
          './viewer/skinComps/BaseButton/ButtonShadowRight.skin' /* webpackChunkName: "SiteButton_ButtonShadowRight" */
        ).then(componentModule => {
          return {
            component: componentModule.default,
          };
        });
      },
      'ButtonShadowRight',
    );

    hostAPI.registerComponent(
      'SiteButton',
      () => {
        return import(
          './viewer/skinComps/BaseButton/ButtonThreeD.skin' /* webpackChunkName: "SiteButton_ButtonThreeD" */
        ).then(componentModule => {
          return {
            component: componentModule.default,
          };
        });
      },
      'ButtonThreeD',
    );

    hostAPI.registerComponent(
      'SiteButton',
      () => {
        return import(
          './viewer/skinComps/BaseButton/CircleButton.skin' /* webpackChunkName: "SiteButton_CircleButton" */
        ).then(componentModule => {
          return {
            component: componentModule.default,
          };
        });
      },
      'CircleButton',
    );

    hostAPI.registerComponent(
      'SiteButton',
      () => {
        return import(
          './viewer/skinComps/BaseButton/DisabledLayerButton.skin' /* webpackChunkName: "SiteButton_DisabledLayerButton" */
        ).then(componentModule => {
          return {
            component: componentModule.default,
          };
        });
      },
      'DisabledLayerButton',
    );

    hostAPI.registerComponent(
      'SiteButton',
      () => {
        return import(
          './viewer/skinComps/BaseButton/EcomFeedbackCheckoutButton.skin' /* webpackChunkName: "SiteButton_EcomFeedbackCheckoutButton" */
        ).then(componentModule => {
          return {
            component: componentModule.default,
          };
        });
      },
      'EcomFeedbackCheckoutButton',
    );

    hostAPI.registerComponent(
      'SiteButton',
      () => {
        return import(
          './viewer/skinComps/BaseButton/EcomFeedbackContinueShopping.skin' /* webpackChunkName: "SiteButton_EcomFeedbackContinueShopping" */
        ).then(componentModule => {
          return {
            component: componentModule.default,
          };
        });
      },
      'EcomFeedbackContinueShopping',
    );

    hostAPI.registerComponent(
      'SiteButton',
      () => {
        return import(
          './viewer/skinComps/BaseButton/EcomFeedbackContinueShopping2.skin' /* webpackChunkName: "SiteButton_EcomFeedbackContinueShopping2" */
        ).then(componentModule => {
          return {
            component: componentModule.default,
          };
        });
      },
      'EcomFeedbackContinueShopping2',
    );

    hostAPI.registerComponent(
      'SiteButton',
      () => {
        return import(
          './viewer/skinComps/BaseButton/FixedFontButton.skin' /* webpackChunkName: "SiteButton_FixedFontButton" */
        ).then(componentModule => {
          return {
            component: componentModule.default,
          };
        });
      },
      'FixedFontButton',
    );

    hostAPI.registerComponent(
      'SiteButton',
      () => {
        return import(
          './viewer/skinComps/BaseButton/PillButton.skin' /* webpackChunkName: "SiteButton_PillButton" */
        ).then(componentModule => {
          return {
            component: componentModule.default,
          };
        });
      },
      'PillButton',
    );

    hostAPI.registerComponent(
      'SiteButton',
      () => {
        return import(
          './viewer/skinComps/BaseButton/ShineButton.skin' /* webpackChunkName: "SiteButton_ShineButton" */
        ).then(componentModule => {
          return {
            component: componentModule.default,
          };
        });
      },
      'ShineButton',
    );

    hostAPI.registerComponent(
      'SiteButton',
      () => {
        return import(
          './viewer/skinComps/BaseButton/ShinyButtonIISkin.skin' /* webpackChunkName: "SiteButton_ShinyButtonIISkin" */
        ).then(componentModule => {
          return {
            component: componentModule.default,
          };
        });
      },
      'ShinyButtonIISkin',
    );

    hostAPI.registerComponent(
      'SiteButton',
      () => {
        return import(
          './viewer/skinComps/BaseButton/ShinyButtonISkin.skin' /* webpackChunkName: "SiteButton_ShinyButtonISkin" */
        ).then(componentModule => {
          return {
            component: componentModule.default,
          };
        });
      },
      'ShinyButtonISkin',
    );

    hostAPI.registerComponent(
      'SiteButton',
      () => {
        return import(
          './viewer/skinComps/BaseButton/ShinyPillButton.skin' /* webpackChunkName: "SiteButton_ShinyPillButton" */
        ).then(componentModule => {
          return {
            component: componentModule.default,
          };
        });
      },
      'ShinyPillButton',
    );

    hostAPI.registerComponent(
      'SiteButton',
      () => {
        return import(
          './viewer/skinComps/BaseButton/SiteButtonBlueSkin.skin' /* webpackChunkName: "SiteButton_SiteButtonBlueSkin" */
        ).then(componentModule => {
          return {
            component: componentModule.default,
          };
        });
      },
      'SiteButtonBlueSkin',
    );

    hostAPI.registerComponent(
      'SiteButton',
      () => {
        return import(
          './viewer/skinComps/BaseButton/SiteButtonSkin.skin' /* webpackChunkName: "SiteButton_SiteButtonSkin" */
        ).then(componentModule => {
          return {
            component: componentModule.default,
          };
        });
      },
      'SiteButtonSkin',
    );

    hostAPI.registerComponent(
      'SiteButton',
      () => {
        return import(
          './viewer/skinComps/BaseButton/WrappingButton.skin' /* webpackChunkName: "SiteButton_WrappingButton" */
        ).then(componentModule => {
          return {
            component: componentModule.default,
          };
        });
      },
      'WrappingButton',
    );

    hostAPI.registerComponent(
      'SiteButton',
      () => {
        return import(
          './viewer/skinComps/ButtonArrow/ButtonArrow.skin' /* webpackChunkName: "SiteButton_ButtonArrow" */
        ).then(componentModule => {
          return {
            component: componentModule.default,
          };
        });
      },
      'ButtonArrow',
    );

    hostAPI.registerComponent(
      'SiteButton',
      () => {
        return import(
          './viewer/skinComps/ButtonArrow/ButtonArrowLeft.skin' /* webpackChunkName: "SiteButton_ButtonArrowLeft" */
        ).then(componentModule => {
          return {
            component: componentModule.default,
          };
        });
      },
      'ButtonArrowLeft',
    );

    hostAPI.registerComponent(
      'SiteButton',
      () => {
        return import(
          './viewer/skinComps/ButtonDoubleArrowLeft/ButtonDoubleArrowLeft.skin' /* webpackChunkName: "SiteButton_ButtonDoubleArrowLeft" */
        ).then(componentModule => {
          return {
            component: componentModule.default,
          };
        });
      },
      'ButtonDoubleArrowLeft',
    );

    hostAPI.registerComponent(
      'SiteButton',
      () => {
        return import(
          './viewer/skinComps/ButtonDoubleArrowRight/ButtonDoubleArrowRight.skin' /* webpackChunkName: "SiteButton_ButtonDoubleArrowRight" */
        ).then(componentModule => {
          return {
            component: componentModule.default,
          };
        });
      },
      'ButtonDoubleArrowRight',
    );

    hostAPI.registerComponent(
      'SiteButton',
      () => {
        return import(
          './viewer/skinComps/ButtonForked/ButtonForkedLeft.skin' /* webpackChunkName: "SiteButton_ButtonForkedLeft" */
        ).then(componentModule => {
          return {
            component: componentModule.default,
          };
        });
      },
      'ButtonForkedLeft',
    );

    hostAPI.registerComponent(
      'SiteButton',
      () => {
        return import(
          './viewer/skinComps/ButtonForked/ButtonForkedRight.skin' /* webpackChunkName: "SiteButton_ButtonForkedRight" */
        ).then(componentModule => {
          return {
            component: componentModule.default,
          };
        });
      },
      'ButtonForkedRight',
    );

    hostAPI.registerComponent(
      'SiteButton',
      () => {
        return import(
          './viewer/skinComps/ButtonLiftedShadow/ButtonLiftedShadow.skin' /* webpackChunkName: "SiteButton_ButtonLiftedShadow" */
        ).then(componentModule => {
          return {
            component: componentModule.default,
          };
        });
      },
      'ButtonLiftedShadow',
    );

    hostAPI.registerComponent(
      'SiteButton',
      () => {
        return import(
          './viewer/skinComps/ButtonSandclock/ButtonSandclock.skin' /* webpackChunkName: "SiteButton_ButtonSandclock" */
        ).then(componentModule => {
          return {
            component: componentModule.default,
          };
        });
      },
      'ButtonSandclock',
    );

    hostAPI.registerComponent(
      'SiteButton',
      () => {
        return import(
          './viewer/skinComps/GamingButton/GamingButton.skin' /* webpackChunkName: "SiteButton_GamingButton" */
        ).then(componentModule => {
          return {
            component: componentModule.default,
          };
        });
      },
      'GamingButton',
    );

    hostAPI.registerComponent(
      'SiteButton',
      () => {
        return import(
          './viewer/skinComps/IronButton/IronButton.skin' /* webpackChunkName: "SiteButton_IronButton" */
        ).then(componentModule => {
          return {
            component: componentModule.default,
          };
        });
      },
      'IronButton',
    );

    hostAPI.registerComponent(
      'SiteButton',
      () => {
        return import(
          './viewer/skinComps/RibbonButton/RibbonButton.skin' /* webpackChunkName: "SiteButton_RibbonButton" */
        ).then(componentModule => {
          return {
            component: componentModule.default,
          };
        });
      },
      'RibbonButton',
    );

    hostAPI.registerComponent(
      'SiteButton',
      () => {
        return import(
          './viewer/skinComps/ScotchTapeButton/ScotchTapeButton.skin' /* webpackChunkName: "SiteButton_ScotchTapeButton" */
        ).then(componentModule => {
          return {
            component: componentModule.default,
          };
        });
      },
      'ScotchTapeButton',
    );

    hostAPI.registerComponent(
      'SiteButton',
      () => {
        return import(
          './viewer/skinComps/ShinyButtonInverted/ShinyButtonInverted.skin' /* webpackChunkName: "SiteButton_ShinyButtonInverted" */
        ).then(componentModule => {
          return {
            component: componentModule.default,
          };
        });
      },
      'ShinyButtonInverted',
    );

    hostAPI.registerComponent(
      'SiteButton',
      () => {
        return import(
          './viewer/skinComps/ShinyGradientButton/ShinyGradientButton.skin' /* webpackChunkName: "SiteButton_ShinyGradientButton" */
        ).then(componentModule => {
          return {
            component: componentModule.default,
          };
        });
      },
      'ShinyGradientButton',
    );

    hostAPI.registerComponent(
      'SiteButton',
      () => {
        return import(
          './viewer/skinComps/SloopyButton/SloopyButton.skin' /* webpackChunkName: "SiteButton_SloopyButton" */
        ).then(componentModule => {
          return {
            component: componentModule.default,
          };
        });
      },
      'SloopyButton',
    );

    hostAPI.registerComponent(
      'SiteButton',
      () => {
        return import(
          './viewer/skinComps/ViewerButtonBlueSkin/ViewerButtonBlueSkin.skin' /* webpackChunkName: "SiteButton_ViewerButtonBlueSkin" */
        ).then(componentModule => {
          return {
            component: componentModule.default,
          };
        });
      },
      'ViewerButtonBlueSkin',
    );
    hostAPI.registerComponent(
      'SiteButton',
      () => {
        return import(
          './viewer/skinComps/PlasticButton/PlasticButton.skin' /* webpackChunkName: "SiteButton_PlasticButton" */
        ).then(componentModule => {
          return {
            component: componentModule.default,
          };
        });
      },
      'PlasticButton',
    );
  },
};

export default entry;
