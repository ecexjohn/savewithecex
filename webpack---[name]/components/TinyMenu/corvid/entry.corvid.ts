import { ITinyMenuCorvidModel } from '../TinyMenu.types';

const entry: ITinyMenuCorvidModel = {
  componentType: 'TinyMenu',
  sdkType: 'MobileMenu',
  loadSDK: () =>
    import('./TinyMenu.corvid' /* webpackChunkName: "TinyMenu.corvid" */),
};

export default entry;
