import * as React from 'react';
import {
  IOnBackendSocialLogin,
  IOnTokenMessage,
  ISocialVendors,
  IButtonClickedMsg,
  BusinessLogFn,
  IDisplayMode,
} from '../MemberLoginDialog.types';

const MSG_TYPES = {
  AUTH_TOKEN: 'auth-token',
  AUTH_DONE: 'auth-done',
  AUTH_CLICKED: 'auth-clicked',
};

const setPostMessageHandler = (callback: any) => {
  const id = 'wix-social-login';
  const handlerWrap = function(msg: any) {
    let msgData;

    try {
      // error handling for good JSON
      msgData = JSON.parse(msg.data);
    } catch (ee) {
      return;
    }

    if (msgData.id === id) {
      callback(msgData);
    }
  };

  window.addEventListener('message', handlerWrap);
  return () => window.removeEventListener('message', handlerWrap);
};

const onSocialLoginIframeMessage = (
  onTokenMessage: IOnTokenMessage,
  onBackendSocialLogin: IOnBackendSocialLogin,
  reportBi: BusinessLogFn,
  setErrorMsg: any,
  layout: IDisplayMode,
  isCommunityChecked?: boolean,
) => (msg: any) => {
  switch (msg.type) {
    case MSG_TYPES.AUTH_CLICKED:
      reportButtonClicked(msg, reportBi, layout);
      break;
    case MSG_TYPES.AUTH_TOKEN:
      onTokenReceived(msg, onTokenMessage, isCommunityChecked);
      break;
    case MSG_TYPES.AUTH_DONE:
      onSocialLoginDone(
        msg,
        onBackendSocialLogin,
        setErrorMsg,
        isCommunityChecked,
      );
      break;
    default:
      return;
  }
};

const onTokenReceived = (
  { token, vendor }: { token: string; vendor: ISocialVendors },
  onTokenMessage: IOnTokenMessage,
  isCommunityChecked?: boolean,
) => {
  if (!token || typeof onTokenMessage !== 'function') {
    return;
  }
  onTokenMessage(token, vendor, isCommunityChecked);
};

const onSocialLoginDone = (
  msg: any,
  onBackendSocialLogin: IOnBackendSocialLogin,
  setErrorMsg: any,
  isCommunityChecked?: boolean,
) => {
  if (msg.error) {
    setErrorMsg(msg.error);
    return;
  }
  onBackendSocialLogin(JSON.parse(msg.data), 'google', isCommunityChecked);
};

export const useAuthIframeSubscription = (
  onTokenMessage: IOnTokenMessage,
  onBackendSocialLogin: IOnBackendSocialLogin,
  reportBi: BusinessLogFn,
  layout: IDisplayMode,
  isCommunityChecked?: boolean,
) => {
  React.useEffect(() => {
    return setPostMessageHandler(
      onSocialLoginIframeMessage(
        onTokenMessage,
        onBackendSocialLogin,
        reportBi,
        () => {},
        layout,
        isCommunityChecked,
      ),
    );
  }, [
    isCommunityChecked,
    layout,
    onBackendSocialLogin,
    onTokenMessage,
    reportBi,
  ]);
};

export const reportButtonClicked = (
  msg: IButtonClickedMsg,
  reportBi: BusinessLogFn,
  layout: IDisplayMode,
) => {
  reportBi(
    {
      src: 5,
      evid: 605,
      socialNetwork: msg.vendor,
      layout,
      ...msg,
    },
    { endpoint: 'site-members' },
  );
};
