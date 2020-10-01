import { IFooterContainerCorvidModel } from '../FooterContainer.types';

const entry: IFooterContainerCorvidModel = {
  componentType: 'FooterContainer',
  sdkType: 'Footer',
  loadSDK: () =>
    import(
      './FooterContainer.corvid' /* webpackChunkName: "FooterContainer.corvid" */
    ),
};

export default entry;
