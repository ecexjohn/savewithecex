import { IVerticalMenuCorvidModel } from '../VerticalMenu.types';

const entry: IVerticalMenuCorvidModel = {
  componentType: 'VerticalMenu',
  sdkType: 'Menu',
  loadSDK: () =>
    import(
      '../../../core/corvid/Menu/Menu.corvid' /* webpackChunkName: "VerticalMenu.corvid" */
    ),
};

export default entry;
