import { ICheckboxGroupCorvidModel } from '../CheckboxGroup.types';

const entry: ICheckboxGroupCorvidModel = {
  componentType: 'CheckboxGroup',
  loadSDK: () =>
    import(
      './CheckboxGroup.corvid' /* webpackChunkName: "CheckboxGroup.corvid" */
    ),
};

export default entry;
