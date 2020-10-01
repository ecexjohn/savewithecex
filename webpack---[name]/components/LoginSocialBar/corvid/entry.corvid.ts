import { ILoginSocialBarCorvidModel } from '../LoginSocialBar.types';

const entry: ILoginSocialBarCorvidModel = {
  componentType: 'LoginSocialBar',
  sdkType: 'AccountNavBar',
  loadSDK: () =>
    import(
      './LoginSocialBar.corvid' /* webpackChunkName: "LoginSocialBar.corvid" */
    ),
};

export default entry;
