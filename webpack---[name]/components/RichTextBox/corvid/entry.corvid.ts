import { IRichTextBoxCorvidModel } from '../RichTextBox.types';

const entry: IRichTextBoxCorvidModel = {
  componentType: 'RichTextBox',
  loadSDK: () =>
    import('./RichTextBox.corvid' /* webpackChunkName: "RichTextBox.corvid" */),
};

export default entry;
