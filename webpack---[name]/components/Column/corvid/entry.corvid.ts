import { IMediaContainerCorvidModel } from '../../MediaContainer/MediaContainer.types';
import { componentType } from '../constants';

const entry: IMediaContainerCorvidModel = {
  componentType,
  sdkType: 'Container',
  loadSDK: () =>
    import(
      '../../MediaContainer/corvid/MediaContainer.corvid' /* webpackChunkName: "Column.corvid" */
    ),
};

export default entry;
