import { IThunderboltEntry } from '@wix/editor-elements-types';

const entry: IThunderboltEntry = {
  loadComponent: hostAPI => {
    hostAPI.registerComponent('VerticalAnchorsMenu', () => {
      return import(
        './viewer/skinComps/VerticalAnchorsMenuTextSkin/VerticalAnchorsMenuText.skin' /* webpackChunkName: "VerticalAnchorsMenu" */
      ).then(componentModule => {
        return {
          component: componentModule.default,
        };
      });
    });
    hostAPI.registerComponent(
      'VerticalAnchorsMenu',
      () => {
        return import(
          './viewer/skinComps/VerticalAnchorsMenuTextSkin/VerticalAnchorsMenuText.skin' /* webpackChunkName: "VerticalAnchorsMenu_VerticalAnchorsMenuTextSkin" */
        ).then(componentModule => {
          return {
            component: componentModule.default,
          };
        });
      },
      'VerticalAnchorsMenuTextSkin',
    );
    hostAPI.registerComponent(
      'VerticalAnchorsMenu',
      () => {
        return import(
          './viewer/skinComps/VerticalAnchorsMenuSymbolSkin/VerticalAnchorsMenuSymbol.skin' /* webpackChunkName: "VerticalAnchorsMenu_VerticalAnchorsMenuSymbolSkin" */
        ).then(componentModule => {
          return {
            component: componentModule.default,
          };
        });
      },
      'VerticalAnchorsMenuSymbolSkin',
    );
    hostAPI.registerComponent(
      'VerticalAnchorsMenu',
      () => {
        return import(
          './viewer/skinComps/VerticalAnchorsMenuSymbolWithTextSkin/VerticalAnchorsMenuSymbolWithText.skin' /* webpackChunkName: "VerticalAnchorsMenu_VerticalAnchorsMenuSymbolWithTextSkin" */
        ).then(componentModule => {
          return {
            component: componentModule.default,
          };
        });
      },
      'VerticalAnchorsMenuSymbolWithTextSkin',
    );
    hostAPI.registerComponent(
      'VerticalAnchorsMenu',
      () => {
        return import(
          './viewer/skinComps/VerticalAnchorsMenuSymbolWithHiddenTextSkin/VerticalAnchorsMenuSymbolWithHiddenText.skin' /* webpackChunkName: "VerticalAnchorsMenu_VerticalAnchorsMenuSymbolWithHiddenTextSkin" */
        ).then(componentModule => {
          return {
            component: componentModule.default,
          };
        });
      },
      'VerticalAnchorsMenuSymbolWithHiddenTextSkin',
    );
    hostAPI.registerComponent(
      'VerticalAnchorsMenu',
      () => {
        return import(
          './viewer/skinComps/VerticalAnchorsMenuLinkedNoTextSkin/VerticalAnchorsMenuLinkedNoText.skin' /* webpackChunkName: "VerticalAnchorsMenu_VerticalAnchorsMenuLinkedNoTextSkin" */
        ).then(componentModule => {
          return {
            component: componentModule.default,
          };
        });
      },
      'VerticalAnchorsMenuLinkedNoTextSkin',
    );
  },
};

export default entry;
