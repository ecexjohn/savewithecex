import { IPageBackgroundCorvidModel } from '../PageBackground.types';

const entry: IPageBackgroundCorvidModel = {
  componentType: 'PageBackground',
  loadSDK: () =>
    import(
      './PageBackground.corvid' /* webpackChunkName: "PageBackground.corvid" */
    ),
};

export default entry;
