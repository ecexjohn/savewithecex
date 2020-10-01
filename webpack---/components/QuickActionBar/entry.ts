import { IThunderboltEntry } from '@wix/editor-elements-types';

const entry: IThunderboltEntry = {
  loadComponent: hostAPI => {
    hostAPI.registerComponent(
      'QuickActionBar',
      () => {
        return Promise.all([
          import(
            './viewer/skinComps/fixed/AnchoredSkin/AnchoredSkin' /* webpackChunkName: "QuickActionBar_anchoredSkin" */
          ),
          import(
            './viewer/QuickActionBar.controller' /* webpackChunkName: "QuickActionBar_anchoredSkin" */
          ),
        ]).then(([componentModule, controllerModule]) => {
          return {
            component: componentModule.default,
            controller: controllerModule.default,
          };
        });
      },
      'anchoredSkin',
    );
    hostAPI.registerComponent(
      'QuickActionBar',
      () => {
        return Promise.all([
          import(
            './viewer/skinComps/fixed/RectSkin/RectSkin' /* webpackChunkName: "QuickActionBar_rectSkin" */
          ),
          import(
            './viewer/QuickActionBar.controller' /* webpackChunkName: "QuickActionBar_rectSkin" */
          ),
        ]).then(([componentModule, controllerModule]) => {
          return {
            component: componentModule.default,
            controller: controllerModule.default,
          };
        });
      },
      'rectSkin',
    );
    hostAPI.registerComponent(
      'QuickActionBar',
      () => {
        return Promise.all([
          import(
            './viewer/skinComps/fixed/OvalSkin/OvalSkin' /* webpackChunkName: "QuickActionBar_ovalSkin" */
          ),
          import(
            './viewer/QuickActionBar.controller' /* webpackChunkName: "QuickActionBar_ovalSkin" */
          ),
        ]).then(([componentModule, controllerModule]) => {
          return {
            component: componentModule.default,
            controller: controllerModule.default,
          };
        });
      },
      'ovalSkin',
    );
    hostAPI.registerComponent(
      'QuickActionBar',
      () => {
        return Promise.all([
          import(
            './viewer/skinComps/floating/FloatingSkin' /* webpackChunkName: "QuickActionBar_floatingSkin" */
          ),
          import(
            './viewer/QuickActionBar.controller' /* webpackChunkName: "QuickActionBar_floatingSkin" */
          ),
        ]).then(([componentModule, controllerModule]) => {
          return {
            component: componentModule.default,
            controller: controllerModule.default,
          };
        });
      },
      'floatingSkin',
    );
  },
};

export default entry;
