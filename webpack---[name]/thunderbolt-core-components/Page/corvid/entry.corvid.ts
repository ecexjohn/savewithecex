import { IPageCorvidModel } from '../Page.types';

const entry: IPageCorvidModel = {
  componentType: 'Page',
  loadSDK: () => import('./Page.corvid' /* webpackChunkName: "Page.corvid" */),
};

export default entry;
