import { IFormContainerCorvidModel } from '../FormContainer.types';

const entry: IFormContainerCorvidModel = {
  componentType: 'FormContainer',
  sdkType: 'Form',
  loadSDK: () =>
    import(
      './FormContainer.corvid' /* webpackChunkName: "FormContainer.corvid" */
    ),
};

export default entry;
