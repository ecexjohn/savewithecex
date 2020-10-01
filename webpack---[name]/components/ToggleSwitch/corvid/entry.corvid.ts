import { IToggleSwitchCorvidModel } from '../ToggleSwitch.types';

const entry: IToggleSwitchCorvidModel = {
  componentType: 'ToggleSwitch',
  sdkType: 'Switch',
  loadSDK: () =>
    import(
      './ToggleSwitch.corvid' /* webpackChunkName: "ToggleSwitch.corvid" */
    ),
};

export default entry;
