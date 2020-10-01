import { IDropDownMenuCorvidModel } from '../DropDownMenu.types';

const entry: IDropDownMenuCorvidModel = {
  componentType: 'DropDownMenu',
  sdkType: 'Menu',
  loadSDK: () =>
    import(
      '../../../core/corvid/Menu/Menu.corvid' /* webpackChunkName: "DropDownMenu.corvid" */
    ),
};

export default entry;
