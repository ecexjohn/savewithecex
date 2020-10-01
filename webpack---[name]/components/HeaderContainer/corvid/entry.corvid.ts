import { IHeaderContainerCorvidModel } from '../HeaderContainer.types';

const entry: IHeaderContainerCorvidModel = {
  componentType: 'HeaderContainer',
  sdkType: 'Header',
  loadSDK: () =>
    import(
      './HeaderContainer.corvid' /* webpackChunkName: "HeaderContainer.corvid" */
    ),
};

export default entry;
