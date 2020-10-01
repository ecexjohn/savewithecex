import { IAnchorCorvidModel } from '../Anchor.types';

const entry: IAnchorCorvidModel = {
  componentType: 'Anchor',
  loadSDK: () =>
    import('./Anchor.corvid' /* webpackChunkName: "Anchor.corvid" */),
};

export default entry;
