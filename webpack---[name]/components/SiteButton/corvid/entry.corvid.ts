import { ISiteButtonCorvidModel } from '../SiteButton.types';

const entry: ISiteButtonCorvidModel = {
  componentType: 'SiteButton',
  sdkType: 'Button',
  loadSDK: () =>
    import('./SiteButton.corvid' /* webpackChunkName: "SiteButton.corvid" */),
};

export default entry;
