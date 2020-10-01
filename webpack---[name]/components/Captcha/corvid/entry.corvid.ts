import { ICaptchaCorvidModel } from '../Captcha.types';

const entry: ICaptchaCorvidModel = {
  componentType: 'Captcha',
  loadSDK: () =>
    import('./Captcha.corvid' /* webpackChunkName: "Captcha.corvid" */),
};

export default entry;
