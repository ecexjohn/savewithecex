import { ITextAreaInputCorvidModel } from '../TextAreaInput.types';

const entry: ITextAreaInputCorvidModel = {
  componentType: 'TextAreaInput',
  sdkType: 'TextBox',
  loadSDK: () =>
    import(
      './TextAreaInput.corvid' /* webpackChunkName: "TextAreaInput.corvid" */
    ),
};

export default entry;
