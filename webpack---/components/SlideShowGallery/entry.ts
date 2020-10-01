import { IThunderboltEntry } from '@wix/editor-elements-types';

const entry: IThunderboltEntry = {
  loadComponent: hostAPI => {
    hostAPI.registerComponent(
      'SlideShowGallery',
      () => {
        return Promise.all([
          import(
            './viewer/skinComps/SlideShowPolaroid/SlideShowPolaroid.skin' /* webpackChunkName: "SlideShowGallery_SlideShowPolaroid" */
          ),
          import(
            './viewer/SlideShowGallery.controller' /* webpackChunkName: "SlideShowGallery_SlideShowPolaroid" */
          ),
        ]).then(([componentModule, controllerModule]) => {
          return {
            component: componentModule.default,
            controller: controllerModule.default,
          };
        });
      },
      'SlideShowPolaroid',
    );

    hostAPI.registerComponent(
      'SlideShowGallery',
      () => {
        return Promise.all([
          import(
            './viewer/skinComps/SlideShowTextOverlay/SlideShowTextOverlay.skin' /* webpackChunkName: "SlideShowGallery_SlideShowTextOverlay" */
          ),
          import(
            './viewer/SlideShowGallery.controller' /* webpackChunkName: "SlideShowGallery_SlideShowTextOverlay" */
          ),
        ]).then(([componentModule, controllerModule]) => {
          return {
            component: componentModule.default,
            controller: controllerModule.default,
          };
        });
      },
      'SlideShowTextOverlay',
    );

    hostAPI.registerComponent(
      'SlideShowGallery',
      () => {
        return Promise.all([
          import(
            './viewer/skinComps/SlideShowTextRight/SlideShowTextRight.skin' /* webpackChunkName: "SlideShowGallery_SlideShowTextRight" */
          ),
          import(
            './viewer/SlideShowGallery.controller' /* webpackChunkName: "SlideShowGallery_SlideShowTextRight" */
          ),
        ]).then(([componentModule, controllerModule]) => {
          return {
            component: componentModule.default,
            controller: controllerModule.default,
          };
        });
      },
      'SlideShowTextRight',
    );

    hostAPI.registerComponent(
      'SlideShowGallery',
      () => {
        return Promise.all([
          import(
            './viewer/skinComps/SlideShowScotchTape/SlideShowScotchTape.skin' /* webpackChunkName: "SlideShowGallery_SlideShowScotchTape" */
          ),
          import(
            './viewer/SlideShowGallery.controller' /* webpackChunkName: "SlideShowGallery_SlideShowScotchTape" */
          ),
        ]).then(([componentModule, controllerModule]) => {
          return {
            component: componentModule.default,
            controller: controllerModule.default,
          };
        });
      },
      'SlideShowScotchTape',
    );

    hostAPI.registerComponent(
      'SlideShowGallery',
      () => {
        return Promise.all([
          import(
            './viewer/skinComps/SlideShowTextBottom/SlideShowTextBottom.skin' /* webpackChunkName: "SlideShowGallery_SlideShowTextBottom" */
          ),
          import(
            './viewer/SlideShowGallery.controller' /* webpackChunkName: "SlideShowGallery_SlideShowTextBottom" */
          ),
        ]).then(([componentModule, controllerModule]) => {
          return {
            component: componentModule.default,
            controller: controllerModule.default,
          };
        });
      },
      'SlideShowTextBottom',
    );

    hostAPI.registerComponent(
      'SlideShowGallery',
      () => {
        return Promise.all([
          import(
            './viewer/skinComps/SlideShowTextFloating/SlideShowTextFloating.skin' /* webpackChunkName: "SlideShowGallery_SlideShowTextFloating" */
          ),
          import(
            './viewer/SlideShowGallery.controller' /* webpackChunkName: "SlideShowGallery_SlideShowTextFloating" */
          ),
        ]).then(([componentModule, controllerModule]) => {
          return {
            component: componentModule.default,
            controller: controllerModule.default,
          };
        });
      },
      'SlideShowTextFloating',
    );

    hostAPI.registerComponent(
      'SlideShowGallery',
      () => {
        return Promise.all([
          import(
            './viewer/skinComps/SlideShowGalleryLiftedShadowSkin/SlideShowGalleryLiftedShadowSkin.skin' /* webpackChunkName: "SlideShowGallery_SlideShowGalleryLiftedShadowSkin" */
          ),
          import(
            './viewer/SlideShowGallery.controller' /* webpackChunkName: "SlideShowGallery_SlideShowGalleryLiftedShadowSkin" */
          ),
        ]).then(([componentModule, controllerModule]) => {
          return {
            component: componentModule.default,
            controller: controllerModule.default,
          };
        });
      },
      'SlideShowGalleryLiftedShadowSkin',
    );

    hostAPI.registerComponent(
      'SlideShowGallery',
      () => {
        return Promise.all([
          import(
            './viewer/skinComps/SlideShowGallerySloopy/SlideShowGallerySloopy.skin' /* webpackChunkName: "SlideShowGallery_SlideShowGallerySloopy" */
          ),
          import(
            './viewer/SlideShowGallery.controller' /* webpackChunkName: "SlideShowGallery_SlideShowGallerySloopy" */
          ),
        ]).then(([componentModule, controllerModule]) => {
          return {
            component: componentModule.default,
            controller: controllerModule.default,
          };
        });
      },
      'SlideShowGallerySloopy',
    );

    hostAPI.registerComponent(
      'SlideShowGallery',
      () => {
        return Promise.all([
          import(
            './viewer/skinComps/BlogSlideShow/BlogSlideShow.skin' /* webpackChunkName: "SlideShowGallery_BlogSlideShow" */
          ),
          import(
            './viewer/SlideShowGallery.controller' /* webpackChunkName: "SlideShowGallery_BlogSlideShow" */
          ),
        ]).then(([componentModule, controllerModule]) => {
          return {
            component: componentModule.default,
            controller: controllerModule.default,
          };
        });
      },
      'BlogSlideShow',
    );

    hostAPI.registerComponent(
      'SlideShowGallery',
      () => {
        return Promise.all([
          import(
            './viewer/skinComps/SlideShowIron/SlideShowIron.skin' /* webpackChunkName: "SlideShowGallery_SlideShowIron" */
          ),
          import(
            './viewer/SlideShowGallery.controller' /* webpackChunkName: "SlideShowGallery_SlideShowIron" */
          ),
        ]).then(([componentModule, controllerModule]) => {
          return {
            component: componentModule.default,
            controller: controllerModule.default,
          };
        });
      },
      'SlideShowIron',
    );

    hostAPI.registerComponent(
      'SlideShowGallery',
      () => {
        return Promise.all([
          import(
            './viewer/skinComps/SlideShowCleanAndSimple/SlideShowCleanAndSimple.skin' /* webpackChunkName: "SlideShowGallery_SlideShowCleanAndSimple" */
          ),
          import(
            './viewer/SlideShowGallery.controller' /* webpackChunkName: "SlideShowGallery_SlideShowCleanAndSimple" */
          ),
        ]).then(([componentModule, controllerModule]) => {
          return {
            component: componentModule.default,
            controller: controllerModule.default,
          };
        });
      },
      'SlideShowCleanAndSimple',
    );
  },
};

export default entry;
