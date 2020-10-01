import { IRatingsInputCorvidModel } from '../RatingsInput.types';

const entry: IRatingsInputCorvidModel = {
  componentType: 'RatingsInput',
  loadSDK: () =>
    import(
      './RatingsInput.corvid' /* webpackChunkName: "RatingsInput.corvid" */
    ),
};

export default entry;
