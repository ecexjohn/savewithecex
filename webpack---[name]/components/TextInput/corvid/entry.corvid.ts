import { ITextInputCorvidModel } from '../TextInput.types';

const entry: ITextInputCorvidModel = {
  componentType: 'TextInput',
  loadSDK: () =>
    import('./TextInput.corvid' /* webpackChunkName: "TextInput.corvid" */),
};

export default entry;
