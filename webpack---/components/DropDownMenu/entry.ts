import { IThunderboltEntry } from '@wix/editor-elements-types';

const entry: IThunderboltEntry = {
  loadComponent: hostAPI => {
    // default register
    hostAPI.registerComponent('DropDownMenu', () => {
      return import(
        './viewer/skinComps/OverlineMenuButton/OverlineMenuButtonSkin.skin' /* webpackChunkName: "DropDownMenu" */
      ).then(componentModule => {
        return {
          component: componentModule.default,
        };
      });
    });

    hostAPI.registerComponent(
      'DropDownMenu',
      () => {
        return import(
          './viewer/skinComps/ArrowRightMenuButtonSkin/ArrowRightMenuButtonSkin.skin' /* webpackChunkName: "DropDownMenu_ArrowRightMenuButtonSkin" */
        ).then(componentModule => {
          return {
            component: componentModule.default,
          };
        });
      },
      'ArrowRightMenuButtonSkin',
    );

    hostAPI.registerComponent(
      'DropDownMenu',
      () => {
        return import(
          './viewer/skinComps/ArrowsMenuSkin/ArrowsMenuSkin.skin' /* webpackChunkName: "DropDownMenu_ArrowsMenuSkin" */
        ).then(componentModule => {
          return {
            component: componentModule.default,
          };
        });
      },
      'ArrowsMenuSkin',
    );

    hostAPI.registerComponent(
      'DropDownMenu',
      () => {
        return import(
          './viewer/skinComps/CirclesMenuSkin/CirclesMenuSkin.skin' /* webpackChunkName: "DropDownMenu_CirclesMenuSkin" */
        ).then(componentModule => {
          return {
            component: componentModule.default,
          };
        });
      },
      'CirclesMenuSkin',
    );

    hostAPI.registerComponent(
      'DropDownMenu',
      () => {
        return import(
          './viewer/skinComps/DiagonalMenuSkin/DiagonalMenuSkin.skin' /* webpackChunkName: "DropDownMenu_DiagonalMenuSkin" */
        ).then(componentModule => {
          return {
            component: componentModule.default,
          };
        });
      },
      'DiagonalMenuSkin',
    );

    hostAPI.registerComponent(
      'DropDownMenu',
      () => {
        return import(
          './viewer/skinComps/IndentedMenuButtonSkin/IndentedMenuButtonSkin.skin' /* webpackChunkName: "DropDownMenu_IndentedMenuButtonSkin" */
        ).then(componentModule => {
          return {
            component: componentModule.default,
          };
        });
      },
      'IndentedMenuButtonSkin',
    );

    hostAPI.registerComponent(
      'DropDownMenu',
      () => {
        return import(
          './viewer/skinComps/LinesMenuButton/LinesMenuButtonBorderRadiusFixSkin.skin' /* webpackChunkName: "DropDownMenu_LinesMenuButtonBorderRadiusFixSkin" */
        ).then(componentModule => {
          return {
            component: componentModule.default,
          };
        });
      },
      'LinesMenuButtonBorderRadiusFixSkin',
    );

    hostAPI.registerComponent(
      'DropDownMenu',
      () => {
        return import(
          './viewer/skinComps/LinesMenuButton/LinesMenuButtonSkin.skin' /* webpackChunkName: "DropDownMenu_LinesMenuButtonSkin" */
        ).then(componentModule => {
          return {
            component: componentModule.default,
          };
        });
      },
      'LinesMenuButtonSkin',
    );

    hostAPI.registerComponent(
      'DropDownMenu',
      () => {
        return import(
          './viewer/skinComps/OverlineMenuButton/OverlineMenuButtonHorizontalMenuAdaptationSkin.skin' /* webpackChunkName: "DropDownMenu_OverlineMenuButtonHorizontalMenuAdaptationSkin" */
        ).then(componentModule => {
          return {
            component: componentModule.default,
          };
        });
      },
      'OverlineMenuButtonHorizontalMenuAdaptationSkin',
    );

    hostAPI.registerComponent(
      'DropDownMenu',
      () => {
        return import(
          './viewer/skinComps/OverlineMenuButton/OverlineMenuButtonSkin.skin' /* webpackChunkName: "DropDownMenu_OverlineMenuButtonSkin" */
        ).then(componentModule => {
          return {
            component: componentModule.default,
          };
        });
      },
      'OverlineMenuButtonSkin',
    );

    hostAPI.registerComponent(
      'DropDownMenu',
      () => {
        return import(
          './viewer/skinComps/PointerMenuButton/PointerMenuButtonHorizontalMenuAdaptationSkin.skin' /* webpackChunkName: "DropDownMenu_PointerMenuButtonHorizontalMenuAdaptationSkin" */
        ).then(componentModule => {
          return {
            component: componentModule.default,
          };
        });
      },
      'PointerMenuButtonHorizontalMenuAdaptationSkin',
    );

    hostAPI.registerComponent(
      'DropDownMenu',
      () => {
        return import(
          './viewer/skinComps/PointerMenuButton/PointerMenuButtonSkin.skin' /* webpackChunkName: "DropDownMenu_PointerMenuButtonSkin" */
        ).then(componentModule => {
          return {
            component: componentModule.default,
          };
        });
      },
      'PointerMenuButtonSkin',
    );

    hostAPI.registerComponent(
      'DropDownMenu',
      () => {
        return import(
          './viewer/skinComps/RibbonsMenuButtonSkin/RibbonsMenuButtonSkin.skin' /* webpackChunkName: "DropDownMenu_RibbonsMenuButtonSkin" */
        ).then(componentModule => {
          return {
            component: componentModule.default,
          };
        });
      },
      'RibbonsMenuButtonSkin',
    );

    hostAPI.registerComponent(
      'DropDownMenu',
      () => {
        return import(
          './viewer/skinComps/SeparateArrowDownMenuSkin/SeparateArrowDownMenuSkin.skin' /* webpackChunkName: "DropDownMenu_SeparateArrowDownMenuSkin" */
        ).then(componentModule => {
          return {
            component: componentModule.default,
          };
        });
      },
      'SeparateArrowDownMenuSkin',
    );

    hostAPI.registerComponent(
      'DropDownMenu',
      () => {
        return import(
          './viewer/skinComps/SeparateBasicMenuButtonSkin/SeparateBasicMenuButtonSkin.skin' /* webpackChunkName: "DropDownMenu_SeparateBasicMenuButtonSkin" */
        ).then(componentModule => {
          return {
            component: componentModule.default,
          };
        });
      },
      'SeparateBasicMenuButtonSkin',
    );

    hostAPI.registerComponent(
      'DropDownMenu',
      () => {
        return import(
          './viewer/skinComps/SeparateIndentedMenuButtonSkin/SeparateIndentedMenuButtonSkin.skin' /* webpackChunkName: "DropDownMenu_SeparateIndentedMenuButtonSkin" */
        ).then(componentModule => {
          return {
            component: componentModule.default,
          };
        });
      },
      'SeparateIndentedMenuButtonSkin',
    );

    hostAPI.registerComponent(
      'DropDownMenu',
      () => {
        return import(
          './viewer/skinComps/SeparateLinesMenuButton/SeparateLinesMenuButtonHorizontalMenuAdaptationSkin.skin' /* webpackChunkName: "DropDownMenu_SeparateLinesMenuButtonHorizontalMenuAdaptationSkin" */
        ).then(componentModule => {
          return {
            component: componentModule.default,
          };
        });
      },
      'SeparateLinesMenuButtonHorizontalMenuAdaptationSkin',
    );

    hostAPI.registerComponent(
      'DropDownMenu',
      () => {
        return import(
          './viewer/skinComps/SeparateLinesMenuButton/SeparateLinesMenuButtonSkin.skin' /* webpackChunkName: "DropDownMenu_SeparateLinesMenuButtonSkin" */
        ).then(componentModule => {
          return {
            component: componentModule.default,
          };
        });
      },
      'SeparateLinesMenuButtonSkin',
    );

    hostAPI.registerComponent(
      'DropDownMenu',
      () => {
        return import(
          './viewer/skinComps/SeparateShinyIIMenuButton/SeparateShinyIIMenuButtonBorderRadiusFixSkin.skin' /* webpackChunkName: "DropDownMenu_SeparateShinyIIMenuButtonBorderRadiusFixSkin" */
        ).then(componentModule => {
          return {
            component: componentModule.default,
          };
        });
      },
      'SeparateShinyIIMenuButtonBorderRadiusFixSkin',
    );

    hostAPI.registerComponent(
      'DropDownMenu',
      () => {
        return import(
          './viewer/skinComps/SeparateShinyIIMenuButton/SeparateShinyIIMenuButtonSkin.skin' /* webpackChunkName: "DropDownMenu_SeparateShinyIIMenuButtonSkin" */
        ).then(componentModule => {
          return {
            component: componentModule.default,
          };
        });
      },
      'SeparateShinyIIMenuButtonSkin',
    );

    hostAPI.registerComponent(
      'DropDownMenu',
      () => {
        return import(
          './viewer/skinComps/SeparateShinyIMenuButtonSkin/SeparateShinyIMenuButtonSkin.skin' /* webpackChunkName: "DropDownMenu_SeparateShinyIMenuButtonSkin" */
        ).then(componentModule => {
          return {
            component: componentModule.default,
          };
        });
      },
      'SeparateShinyIMenuButtonSkin',
    );

    hostAPI.registerComponent(
      'DropDownMenu',
      () => {
        return import(
          './viewer/skinComps/SeparatedArrowsMenuSkin/SeparatedArrowsMenuSkin.skin' /* webpackChunkName: "DropDownMenu_SeparatedArrowsMenuSkin" */
        ).then(componentModule => {
          return {
            component: componentModule.default,
          };
        });
      },
      'SeparatedArrowsMenuSkin',
    );

    hostAPI.registerComponent(
      'DropDownMenu',
      () => {
        return import(
          './viewer/skinComps/ShinyMenuIButtonSkin/ShinyMenuIButtonSkin.skin' /* webpackChunkName: "DropDownMenu_ShinyMenuIButtonSkin" */
        ).then(componentModule => {
          return {
            component: componentModule.default,
          };
        });
      },
      'ShinyMenuIButtonSkin',
    );

    hostAPI.registerComponent(
      'DropDownMenu',
      () => {
        return import(
          './viewer/skinComps/ShinyMenuIIButtonSkin/ShinyMenuIIButtonSkin.skin' /* webpackChunkName: "DropDownMenu_ShinyMenuIIButtonSkin" */
        ).then(componentModule => {
          return {
            component: componentModule.default,
          };
        });
      },
      'ShinyMenuIIButtonSkin',
    );

    hostAPI.registerComponent(
      'DropDownMenu',
      () => {
        return import(
          './viewer/skinComps/SloppyBorderMenuButtonSkin/SloppyBorderMenuButtonSkin.skin' /* webpackChunkName: "DropDownMenu_SloppyBorderMenuButtonSkin" */
        ).then(componentModule => {
          return {
            component: componentModule.default,
          };
        });
      },
      'SloppyBorderMenuButtonSkin',
    );

    hostAPI.registerComponent(
      'DropDownMenu',
      () => {
        return import(
          './viewer/skinComps/SolidColorMenuButtonSkin/SolidColorMenuButtonSkin.skin' /* webpackChunkName: "DropDownMenu_SolidColorMenuButtonSkin" */
        ).then(componentModule => {
          return {
            component: componentModule.default,
          };
        });
      },
      'SolidColorMenuButtonSkin',
    );

    hostAPI.registerComponent(
      'DropDownMenu',
      () => {
        return import(
          './viewer/skinComps/TextOnlyMenuButtonBgFixSkin/TextOnlyMenuButtonBgFixSkin.skin' /* webpackChunkName: "DropDownMenu_TextOnlyMenuButtonBgFixSkin" */
        ).then(componentModule => {
          return {
            component: componentModule.default,
          };
        });
      },
      'TextOnlyMenuButtonBgFixSkin',
    );

    hostAPI.registerComponent(
      'DropDownMenu',
      () => {
        return import(
          './viewer/skinComps/TextOnlyMenuButtonSkin/TextOnlyMenuButtonSkin.skin' /* webpackChunkName: "DropDownMenu_TextOnlyMenuButtonSkin" */
        ).then(componentModule => {
          return {
            component: componentModule.default,
          };
        });
      },
      'TextOnlyMenuButtonSkin',
    );

    hostAPI.registerComponent(
      'DropDownMenu',
      () => {
        return import(
          './viewer/skinComps/TextSeparatorsMenuButtonSkin/TextSeparatorsMenuButtonSkin.skin' /* webpackChunkName: "DropDownMenu_TextSeparatorsMenuButtonSkin" */
        ).then(componentModule => {
          return {
            component: componentModule.default,
          };
        });
      },
      'TextSeparatorsMenuButtonSkin',
    );

    hostAPI.registerComponent(
      'DropDownMenu',
      () => {
        return import(
          './viewer/skinComps/VerticalRibbonsMenuButtonSkin/VerticalRibbonsMenuButtonSkin.skin' /* webpackChunkName: "DropDownMenu_VerticalRibbonsMenuButtonSkin" */
        ).then(componentModule => {
          return {
            component: componentModule.default,
          };
        });
      },
      'VerticalRibbonsMenuButtonSkin',
    );

    hostAPI.registerComponent(
      'DropDownMenu',
      () => {
        return Promise.all([
          import(
            '../ComboBoxInput/viewer/skinComps/Navigation/ComboBoxInputNavigation.skin' /* webpackChunkName: "DropDownMenu_ComboBoxInputNavigation" */
          ),
          import(
            '../ComboBoxInput/viewer/ComboBoxInput.controller' /* webpackChunkName: "DropDownMenu_ComboBoxInputNavigation" */
          ),
        ]).then(([componentModule, controllerModule]) => {
          return {
            component: componentModule.default,
            controller: controllerModule.default,
          };
        });
      },
      'ComboBoxInputNavigation',
    );

    // TODO not yet implemented legacy skins

    // hostAPI.registerComponent(
    //   'DropDownMenu',
    //   () =>
    //     import(
    //       './viewer/skinComps/ArrowsMenuNSkin/ArrowsMenuNSkin' /* webpackChunkName: "DropDownMenu_ArrowsMenuNSkin" */
    //     ),
    //   'ArrowsMenuNSkin',
    // );

    // hostAPI.registerComponent(
    //   'DropDownMenu',
    //   () =>
    //     import(
    //       './viewer/skinComps/CirclesMenuNSkin/CirclesMenuNSkin' /* webpackChunkName: "DropDownMenu_CirclesMenuNSkin" */
    //     ),
    //   'CirclesMenuNSkin',
    // );

    // hostAPI.registerComponent(
    //   'DropDownMenu',
    //   () =>
    //     import(
    //       './viewer/skinComps/ForkedBannerMenuSkin/ForkedBannerMenuSkin' /* webpackChunkName: "DropDownMenu_ForkedBannerMenuSkin" */
    //       ),
    //   'ForkedBannerMenuSkin',
    // );
    //
    // hostAPI.registerComponent(
    //   'DropDownMenu',
    //   () =>
    //     import(
    //       './viewer/skinComps/ForkedRibbonMenuSkin/ForkedRibbonMenuSkin' /* webpackChunkName: "DropDownMenu_ForkedRibbonMenuSkin" */
    //       ),
    //   'ForkedRibbonMenuSkin',
    // );

    // hostAPI.registerComponent(
    //   'DropDownMenu',
    //   () =>
    //     import(
    //       './viewer/skinComps/SeparateArrowDownMenuNSkin/SeparateArrowDownMenuNSkin' /* webpackChunkName: "DropDownMenu_SeparateArrowDownMenuNSkin" */
    //       ),
    //   'SeparateArrowDownMenuNSkin',
    // );

    // hostAPI.registerComponent(
    //   'DropDownMenu',
    //   () =>
    //     import(
    //       './viewer/skinComps/SeparatedArrowsMenuNSkin/SeparatedArrowsMenuNSkin' /* webpackChunkName: "DropDownMenu_SeparatedArrowsMenuNSkin" */
    //     ),
    //   'SeparatedArrowsMenuNSkin',
    // );

    // hostAPI.registerComponent(
    //   'DropDownMenu',
    //   () =>
    //     import(
    //       './viewer/skinComps/SlantedMenuNSkin/SlantedMenuNSkin' /* webpackChunkName: "DropDownMenu_SlantedMenuNSkin" */
    //     ),
    //   'SlantedMenuNSkin',
    // );
  },
};

export default entry;
