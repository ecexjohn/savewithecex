import { IThunderboltEntry } from '@wix/editor-elements-types';

const entry: IThunderboltEntry = {
  loadComponent: hostAPI => {
    hostAPI.registerComponent('Section', () => {
      return import('./viewer/Section' /* webpackChunkName: "Section" */).then(
        componentModule => {
          return {
            component: componentModule.default,
          };
        },
      );
    });
    hostAPI.registerComponent('HeaderSection', () => {
      return import(
        './viewer/HeaderSection' /* webpackChunkName: "HeaderSection" */
      ).then(componentModule => {
        return {
          component: componentModule.default,
        };
      });
    });
    hostAPI.registerComponent('FooterSection', () => {
      return import(
        './viewer/FooterSection' /* webpackChunkName: "FooterSection" */
      ).then(componentModule => {
        return {
          component: componentModule.default,
        };
      });
    });
    hostAPI.registerComponent('RefComponent', () => {
      return import(
        './viewer/RefComponent' /* webpackChunkName: "RefComponent" */
      ).then(componentModule => {
        return {
          component: componentModule.default,
        };
      });
    });
    hostAPI.registerComponent('MembersAreaSection', () => {
      return import(
        './viewer/MembersAreaSection' /* webpackChunkName: "MembersAreaSection" */
      ).then(componentModule => {
        return {
          component: componentModule.default,
        };
      });
    });
  },
};

export default entry;
