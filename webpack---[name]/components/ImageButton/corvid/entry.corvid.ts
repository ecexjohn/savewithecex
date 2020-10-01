import { ISiteButtonCorvidModel as ImageButtonCorvidModel } from '../../SiteButton/SiteButton.types';

const entry: ImageButtonCorvidModel = {
  componentType: 'ImageButton',
  sdkType: 'Button',
  loadSDK: () =>
    import(
      '../../SiteButton/corvid/SiteButton.corvid' /* webpackChunkName: "ImageButton.corvid" */
    ),
};

export default entry;
