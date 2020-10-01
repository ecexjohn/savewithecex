import { IStripColumnsContainerCorvidModel } from '../StripColumnsContainer.types';

const entry: IStripColumnsContainerCorvidModel = {
  componentType: 'StripColumnsContainer',
  sdkType: 'ColumnStrip',
  loadSDK: () =>
    import(
      './StripColumnsContainer.corvid' /* webpackChunkName: "StripColumnsContainer.corvid" */
    ),
};

export default entry;
