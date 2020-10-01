import { GoogleMapCorvidModel } from '../GoogleMap.types';

const entry: GoogleMapCorvidModel = {
  componentType: 'GoogleMap',
  loadSDK: () =>
    import('./GoogleMap.corvid' /* webpackChunkName: "GoogleMap.corvid" */),
};

export default entry;
