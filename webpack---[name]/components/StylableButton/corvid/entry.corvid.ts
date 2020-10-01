import { IStylableButtonCorvidModel } from '../StylableButton.types';

const entry: IStylableButtonCorvidModel = {
  componentType: 'StylableButton',
  sdkType: 'Button',
  loadSDK: () =>
    import(
      './StylableButton.corvid' /* webpackChunkName: "StylableButton.corvid" */
    ),
};

export default entry;
