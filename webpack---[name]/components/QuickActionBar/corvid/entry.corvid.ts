import { IQuickActionBarCorvidModel } from '../QuickActionBar.types';

const entry: IQuickActionBarCorvidModel = {
  componentType: 'QuickActionBar',
  loadSDK: () =>
    import(
      './QuickActionBar.corvid' /* webpackChunkName: "QuickActionBar.corvid" */
    ),
};

export default entry;
