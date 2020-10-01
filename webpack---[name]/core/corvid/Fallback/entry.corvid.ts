import { IFallbackCorvidModel } from './Fallback.types';

const entry: IFallbackCorvidModel = {
  componentType: 'Fallback',
  loadSDK: () =>
    import('./Fallback.corvid' /* webpackChunkName: "Fallback.corvid" */),
};

export default entry;
