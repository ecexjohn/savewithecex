import { ITimePickerCorvidModel } from '../TimePicker.types';

const entry: ITimePickerCorvidModel = {
  componentType: 'TimePicker',
  loadSDK: () =>
    import('./TimePicker.corvid' /* webpackChunkName: "TimePicker.corvid" */),
};

export default entry;
