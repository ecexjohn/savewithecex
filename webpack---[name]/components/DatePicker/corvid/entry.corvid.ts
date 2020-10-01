import { IDatePickerCorvidModel } from '../DatePicker.types';

const entry: IDatePickerCorvidModel = {
  componentType: 'DatePicker',
  loadSDK: () =>
    import('./DatePicker.corvid' /* webpackChunkName: "DatePicker.corvid" */),
};

export default entry;
