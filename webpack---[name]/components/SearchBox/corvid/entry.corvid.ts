import { CorvidTypes } from '@wix/editor-elements-types';
import { ISearchBoxSDKFactory } from '../SearchBox.types';

const entry: CorvidTypes.ICorvidModel<ISearchBoxSDKFactory> = {
  componentType: 'SearchBox',
  loadSDK: () =>
    import('./SearchBox.corvid' /* webpackChunkName: "SearchBox.corvid" */),
};

export default entry;
