import { IThunderboltEntry } from '@wix/editor-elements-types';

const entry: IThunderboltEntry = {
  loadComponent: hostAPI => {
    hostAPI.registerComponent('VerticalMenu', () => {
      return import(
        './viewer/skinComps/VerticalMenuSeparatedButtonFixedWidthSkin/VerticalMenuSeparatedButtonFixedWidth.skin' /* webpackChunkName: "VerticalMenu" */
      ).then(componentModule => {
        return {
          component: componentModule.default,
        };
      });
    });
    hostAPI.registerComponent(
      'VerticalMenu',
      () => {
        return import(
          './viewer/skinComps/VerticalMenuSeparatedButtonFixedWidthSkin/VerticalMenuSeparatedButtonFixedWidth.skin' /* webpackChunkName: "VerticalMenu_VerticalMenuSeparatedButtonFixedWidthSkin" */
        ).then(componentModule => {
          return {
            component: componentModule.default,
          };
        });
      },
      'VerticalMenuSeparatedButtonFixedWidthSkin',
    );
    hostAPI.registerComponent(
      'VerticalMenu',
      () => {
        return import(
          './viewer/skinComps/VerticalMenuTextWithSeparatorsSkin/VerticalMenuTextWithSeparators.skin' /* webpackChunkName: "VerticalMenu_VerticalMenuTextWithSeparatorsSkin" */
        ).then(componentModule => {
          return {
            component: componentModule.default,
          };
        });
      },
      'VerticalMenuTextWithSeparatorsSkin',
    );
    hostAPI.registerComponent(
      'VerticalMenu',
      () => {
        return import(
          './viewer/skinComps/VerticalMenuTextSkin/VerticalMenuText.skin' /* webpackChunkName: "VerticalMenu_VerticalMenuTextSkin" */
        ).then(componentModule => {
          return {
            component: componentModule.default,
          };
        });
      },
      'VerticalMenuTextSkin',
    );
    hostAPI.registerComponent(
      'VerticalMenu',
      () => {
        return import(
          './viewer/skinComps/VerticalMenuSolidColorSkin/VerticalMenuSolidColor.skin' /* webpackChunkName: "VerticalMenu_VerticalMenuSolidColorSkin" */
        ).then(componentModule => {
          return {
            component: componentModule.default,
          };
        });
      },
      'VerticalMenuSolidColorSkin',
    );
    hostAPI.registerComponent(
      'VerticalMenu',
      () => {
        return import(
          './viewer/skinComps/VerticalMenuSeparatedButtonSkin/VerticalMenuSeparatedButton.skin' /* webpackChunkName: "VerticalMenu_VerticalMenuSeparatedButtonSkin" */
        ).then(componentModule => {
          return {
            component: componentModule.default,
          };
        });
      },
      'VerticalMenuSeparatedButtonSkin',
    );
    hostAPI.registerComponent(
      'VerticalMenu',
      () => {
        return import(
          './viewer/skinComps/VerticalMenuSeparatedButtonFixedWidthSkin/VerticalMenuSeparatedButtonFixedWidth.skin' /* webpackChunkName: "VerticalMenu_VerticalMenuArrowSkin" */
        ).then(componentModule => {
          return {
            component: componentModule.default,
          };
        });
      },
      'VerticalMenuArrowSkin', // legacy skin - should fallback to VerticalMenuSeparatedButtonFixedWidthSkin
    );
    hostAPI.registerComponent(
      'VerticalMenu',
      () => {
        return import(
          './viewer/skinComps/VerticalMenuSeparatedButtonFixedWidthSkin/VerticalMenuSeparatedButtonFixedWidth.skin' /* webpackChunkName: "VerticalMenu_VerticalMenuRibbonsSkin" */
        ).then(componentModule => {
          return {
            component: componentModule.default,
          };
        });
      },
      'VerticalMenuRibbonsSkin', // legacy skin - should fallback to VerticalMenuSeparatedButtonFixedWidthSkin
    );

    hostAPI.registerComponent(
      'VerticalMenu',
      () => {
        return Promise.all([
          import(
            '../ComboBoxInput/viewer/skinComps/Navigation/ComboBoxInputNavigation.skin' /* webpackChunkName: "VerticalMenu_ComboBoxInputNavigation" */
          ),
          import(
            '../ComboBoxInput/viewer/ComboBoxInput.controller' /* webpackChunkName: "VerticalMenu_ComboBoxInputNavigation" */
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
  },
};

export default entry;
