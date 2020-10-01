import { IComboBoxInputCorvidModel } from '../ComboBoxInput.types';

const entry: IComboBoxInputCorvidModel = {
  componentType: 'ComboBoxInput',
  sdkType: 'Dropdown',
  loadSDK: () =>
    import(
      './ComboBoxInput.corvid' /* webpackChunkName: "ComboBoxInput.corvid" */
    ),
};

export default entry;
