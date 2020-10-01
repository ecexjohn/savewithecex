import { IThunderboltEntry } from '@wix/editor-elements-types';

const entry: IThunderboltEntry = {
  loadComponent: hostAPI => {
    hostAPI.registerComponent('TinyMenu', () => {
      return import(
        './viewer/skinComps/BaseMenu/TinyMenuFullScreenSkin.skin' /* webpackChunkName: "TinyMenu" */
      ).then(componentModule => {
        return {
          component: componentModule.default,
        };
      });
    });

    hostAPI.registerComponent(
      'TinyMenu',
      () => {
        return import(
          './viewer/skinComps/BaseMenu/TinyMenuFullScreenSkin.skin' /* webpackChunkName: "TinyMenu_TinyMenuFullScreenSkin" */
        ).then(componentModule => {
          return {
            component: componentModule.default,
          };
        });
      },
      'TinyMenuFullScreenSkin',
    );

    hostAPI.registerComponent(
      'TinyMenu',
      () => {
        return import(
          './viewer/skinComps/BaseMenu/TinyMenuPullFromLeftSkin.skin' /* webpackChunkName: "TinyMenu_TinyMenuPullFromLeftSkin" */
        ).then(componentModule => {
          return {
            component: componentModule.default,
          };
        });
      },
      'TinyMenuPullFromLeftSkin',
    );

    hostAPI.registerComponent(
      'TinyMenu',
      () => {
        return import(
          './viewer/skinComps/BaseMenu/TinyMenuPullFromRightSkin.skin' /* webpackChunkName: "TinyMenu_TinyMenuPullFromRightSkin" */
        ).then(componentModule => {
          return {
            component: componentModule.default,
          };
        });
      },
      'TinyMenuPullFromRightSkin',
    );

    hostAPI.registerComponent(
      'TinyMenu',
      () => {
        return import(
          './viewer/skinComps/BaseMenu/TinyMenuPullFromTopSkin.skin' /* webpackChunkName: "TinyMenu_TinyMenuPullFromTopSkin" */
        ).then(componentModule => {
          return {
            component: componentModule.default,
          };
        });
      },
      'TinyMenuPullFromTopSkin',
    );

    hostAPI.registerComponent(
      'TinyMenu',
      () => {
        return import(
          './viewer/skinComps/TinyMenuSkin/TinyMenuSkin.skin' /* webpackChunkName: "TinyMenu_TinyMenuSkin" */
        ).then(componentModule => {
          return {
            component: componentModule.default,
          };
        });
      },
      'TinyMenuSkin',
    );
  },
};

export default entry;
