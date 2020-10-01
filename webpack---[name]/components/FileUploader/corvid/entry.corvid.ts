import { IFileUploaderCorvidModel } from '../FileUploader.types';

const entry: IFileUploaderCorvidModel = {
  componentType: 'FileUploader',
  sdkType: 'UploadButton',
  loadSDK: () =>
    import(
      './FileUploader.corvid' /* webpackChunkName: "FileUploader.corvid" */
    ),
};

export default entry;
