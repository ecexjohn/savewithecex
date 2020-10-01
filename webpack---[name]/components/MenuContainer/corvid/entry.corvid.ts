import { IMenuContainerCorvidModel } from '../MenuContainer.types';

const entry: IMenuContainerCorvidModel = {
  componentType: 'MenuContainer',
  loadSDK: () =>
    import(
      './MenuContainer.corvid' /* webpackChunkName: "MenuContainer.corvid" */
    ),
};

export default entry;
