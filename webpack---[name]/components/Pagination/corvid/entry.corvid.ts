import { IPaginationCorvidModel } from '../Pagination.types';

const entry: IPaginationCorvidModel = {
  componentType: 'Pagination',
  loadSDK: () =>
    import('./Pagination.corvid' /* webpackChunkName: "Pagination.corvid" */),
};

export default entry;
