import { IRadioGroupCorvidModel } from '../RadioGroup.types';

const entry: IRadioGroupCorvidModel = {
  componentType: 'RadioGroup',
  sdkType: 'RadioButtonGroup',
  loadSDK: () =>
    import('./RadioGroup.corvid' /* webpackChunkName: "RadioGroup.corvid" */),
};

export default entry;
