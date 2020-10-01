import { ImpressCorvidModel } from '../Impress.types';

const entry: ImpressCorvidModel = {
  componentType: 'Impress',
  sdkType: 'Gallery',
  loadSDK: () =>
    import('./Impress.corvid' /* webpackChunkName: "Impress.corvid" */),
};

export default entry;
