import { ISiteButtonCorvidModel as IPopupCloseIconButtonCorvidModel } from '../../SiteButton/SiteButton.types';

const entry: IPopupCloseIconButtonCorvidModel = {
  componentType: 'PopupCloseIconButton',
  sdkType: 'Button',
  loadSDK: () =>
    import(
      '../../SiteButton/corvid/SiteButton.corvid' /* webpackChunkName: "PopupCloseIconButton.corvid" */
    ),
};

export default entry;
