import { IGridCorvidModel } from '../Grid.types';

const entry: IGridCorvidModel = {
  componentType: 'Grid',
  sdkType: 'Table',
  loadSDK: () => import('./Grid.corvid' /* webpackChunkName: "Grid.corvid" */),
};

export default entry;
