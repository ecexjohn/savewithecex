import { IThunderboltEntry } from '@wix/editor-elements-types';

const entry: IThunderboltEntry = {
  loadComponent: hostAPI => {
    hostAPI.registerComponent('DatePicker', () =>
      Promise.all([
        import('./viewer/DatePicker' /* webpackChunkName: "DatePicker" */),
        import(
          './viewer/DatePicker.controller' /* webpackChunkName: "DatePicker" */
        ),
      ]).then(([componentModule, controllerModule]) => ({
        component: componentModule.default,
        controller: controllerModule.default,
      })),
    );
    hostAPI.registerComponent(
      'DatePicker',
      () =>
        Promise.all([
          import(
            './viewer/skinComps/DatePickerDefaultSkin/DatePickerDefaultSkin' /* webpackChunkName: "DatePicker_DatePickerDefaultSkin" */
          ),
          import(
            './viewer/DatePicker.controller' /* webpackChunkName: "DatePicker_DatePickerDefaultSkin" */
          ),
        ]).then(([componentModule, controllerModule]) => ({
          component: componentModule.default,
          controller: controllerModule.default,
        })),
      'DatePickerDefaultSkin',
    );
    hostAPI.registerComponent(
      'DatePicker',
      () =>
        Promise.all([
          import(
            './viewer/skinComps/DatePickerTextBetweenNavSkin/DatePickerTextBetweenNavSkin' /* webpackChunkName: "DatePicker_DatePickerTextBetweenNavSkin" */
          ),
          import(
            './viewer/DatePicker.controller' /* webpackChunkName: "DatePicker_DatePickerTextBetweenNavSkin" */
          ),
        ]).then(([componentModule, controllerModule]) => ({
          component: componentModule.default,
          controller: controllerModule.default,
        })),
      'DatePickerTextBetweenNavSkin',
    );
    hostAPI.registerComponent(
      'DatePicker',
      () =>
        Promise.all([
          import(
            './viewer/skinComps/DatePickerTextYearNavSkin/DatePickerTextYearNavSkin' /* webpackChunkName: "DatePicker_DatePickerTextYearNavSkin" */
          ),
          import(
            './viewer/DatePicker.controller' /* webpackChunkName: "DatePicker_DatePickerTextYearNavSkin" */
          ),
        ]).then(([componentModule, controllerModule]) => ({
          component: componentModule.default,
          controller: controllerModule.default,
        })),
      'DatePickerTextYearNavSkin',
    );
    hostAPI.registerComponent('DatePickerCalendar', () =>
      import(
        './viewer/Calendar/Calendar' /* webpackChunkName: "DatePickerCalendar" */
      ).then(componentModule => ({
        component: componentModule.default,
      })),
    );
  },
};

export default entry;
