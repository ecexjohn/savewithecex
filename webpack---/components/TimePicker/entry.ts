import { IThunderboltEntry } from '@wix/editor-elements-types';

const entry: IThunderboltEntry = {
  loadComponent: hostAPI => {
    hostAPI.registerComponent(
      'TimePicker',
      () => {
        return Promise.all([
          import(
            './viewer/TimePickerDropdown/TimePickerDropdown' /* webpackChunkName: "TimePicker_dropdown" */
          ),
          import(
            './viewer/TimePicker.controller' /* webpackChunkName: "TimePicker_dropdown" */
          ),
        ]).then(([componentModule, controllerModule]) => {
          return {
            component: componentModule.default,
            controller: controllerModule.default,
          };
        });
      },
      'dropdown',
    );
    hostAPI.registerComponent(
      'TimePicker',
      () => {
        return Promise.all([
          import(
            './viewer/TimePickerStepper/TimePickerStepper' /* webpackChunkName: "TimePicker_stepper" */
          ),
          import(
            './viewer/TimePicker.controller' /* webpackChunkName: "TimePicker_stepper" */
          ),
        ]).then(([componentModule, controllerModule]) => {
          return {
            component: componentModule.default,
            controller: controllerModule.default,
          };
        });
      },
      'stepper',
    );
  },
};

export default entry;
