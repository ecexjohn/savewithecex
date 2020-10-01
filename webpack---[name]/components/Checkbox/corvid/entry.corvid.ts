import { ICheckboxCorvidModel } from '../Checkbox.types';

const entry: ICheckboxCorvidModel = {
  componentType: 'Checkbox',
  loadSDK: () =>
    import('./Checkbox.corvid' /* webpackChunkName: "Checkbox.corvid" */),
};

export default entry;
