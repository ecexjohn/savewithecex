import { ICustomElementComponentCorvidModel } from '../CustomElementComponent.types';

const entry: ICustomElementComponentCorvidModel = {
  componentType: 'CustomElementComponent',
  loadSDK: () =>
    import(
      './CustomElementComponent.corvid' /* webpackChunkName: "CustomElementComponent.corvid" */
    ),
};

export default entry;
