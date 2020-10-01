import { IHtmlComponentCorvidModel } from '../HtmlComponent.types';

const entry: IHtmlComponentCorvidModel = {
  componentType: 'HtmlComponent',
  loadSDK: () =>
    import(
      './HtmlComponent.corvid' /* webpackChunkName: "HtmlComponent.corvid" */
    ),
};

export default entry;
