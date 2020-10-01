import { IThunderboltEntry } from '@wix/editor-elements-types';

const entry: IThunderboltEntry = {
  loadComponent: hostAPI => {
    hostAPI.registerComponent('AppWidget', () => {
      return import(
        './viewer/AppWidget' /* webpackChunkName: "AppWidget" */
      ).then(componentModule => {
        return {
          component: componentModule.default,
        };
      });
    });

    hostAPI.registerComponent(
      'AppWidget',
      () => {
        return import(
          './viewer/AppWidget' /* webpackChunkName: "AppWidget_Classic" */
        ).then(componentModule => {
          return {
            component: componentModule.default,
          };
        });
      },
      'Classic',
    );

    hostAPI.registerComponent(
      'AppWidget',
      () => {
        return import(
          './viewer/ResponsiveAppWidget' /* webpackChunkName: "AppWidget_Responsive" */
        ).then(componentModule => {
          return {
            component: componentModule.default,
          };
        });
      },
      'Responsive',
    );

    hostAPI.registerComponent(
      'AppWidget',
      () => {
        return import(
          './viewer/AppWidgetLoader' /* webpackChunkName: "AppWidget_Loader" */
        ).then(componentModule => {
          return {
            component: componentModule.default,
          };
        });
      },
      'Loader',
    );
  },
};

export default entry;
