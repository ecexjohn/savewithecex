import { HoneycombCorvidModel } from '../Honeycomb.types';

const entry: HoneycombCorvidModel = {
  componentType: 'Honeycomb',
  sdkType: 'Gallery',
  loadSDK: () =>
    import('./Honeycomb.corvid' /* webpackChunkName: "Honeycomb.corvid" */),
};

export default entry;
