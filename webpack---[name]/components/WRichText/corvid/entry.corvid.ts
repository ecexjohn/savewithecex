import { IWRichTextCorvidModel } from '../WRichText.types';

const entry: IWRichTextCorvidModel = {
  componentType: 'WRichText',
  sdkType: 'Text',
  loadSDK: () =>
    import('./WRichText.corvid' /* webpackChunkName: "WRichText.corvid" */),
};

export default entry;
