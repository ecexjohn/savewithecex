import { ICorvidModel } from '@wix/editor-elements-types';

const entry: ICorvidModel = {
  componentType: 'VectorImage',
  loadSDK: () =>
    import('./VectorImage.corvid' /* webpackChunkName: "VectorImage.corvid" */),
};

export default entry;
