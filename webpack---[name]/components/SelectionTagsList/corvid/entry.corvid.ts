import { ISelectionTagsListCorvidModel } from '../SelectionTagsList.types';

const entry: ISelectionTagsListCorvidModel = {
  componentType: 'SelectionTagsList',
  sdkType: 'SelectionTags',
  loadSDK: () =>
    import(
      './SelectionTagsList.corvid' /* webpackChunkName: "SelectionTagsList.corvid" */
    ),
};

export default entry;
