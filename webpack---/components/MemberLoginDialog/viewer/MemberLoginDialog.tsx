import * as React from 'react';
import classnames from 'classnames';
import {
  IMemberLoginDialogProps,
  IIFrameConfig,
  ISocialVendors,
} from '../MemberLoginDialog.types';
import Preloader from '../../Preloader/viewer/Preloader';
import { activateByEnterButton } from '../../../core/commons/a11y';
import { SocialAuth } from './SocialAuth';
import { EmailAuth } from './EmailAuth';
import { SmallSocialIcons } from './SmallSocialIcons';
// eslint-disable-next-line import/order
import SiteMembersDialogLayout from '../../SiteMembersDialogLayout/viewer/SiteMembersDialogLayout';
import style from './style/style.scss';
import {
  translationFeature,
  MemberLoginDialogTranslationKeys as keys,
} from './constants';
import { useAuthIframeSubscription } from './useAuthIframeSubscription';

const MemberLoginDialog: React.FC<IMemberLoginDialogProps> = props => {
  /* eslint-disable jsx-a11y/anchor-is-valid */
  const {
    id,
    isSocialLoginGoogleEnabled,
    isSocialLoginFacebookEnabled,
    isEmailLoginEnabled,
    submit,
    onSwitchDialogLinkClick,
    onForgetYourPasswordClick,
    language,
    biVisitorId,
    smCollectionId,
    svSession,
    metaSiteId,
    onCloseDialogCallback,
    isCloseable,
    onTokenMessage,
    onBackendSocialLogin,
    reportBi,
    displayMode,
  } = props;
  const translate = props.translate!.bind(null, translationFeature);

  const headlineId = `loginHeadline_${id}`;

  useAuthIframeSubscription(
    onTokenMessage,
    onBackendSocialLogin,
    reportBi,
    displayMode,
  );

  const iframeConfig: IIFrameConfig = {
    language,
    biVisitorId,
    smCollectionId,
    svSession,
    metaSiteId,
    isCommunityChecked: false,
    useGoogleSdk: props.useGoogleSdk,
  };

  const enabledSocialVendors = new Set<ISocialVendors>();
  if (isSocialLoginGoogleEnabled) {
    enabledSocialVendors.add('google');
  }
  if (isSocialLoginFacebookEnabled) {
    enabledSocialVendors.add('facebook');
  }
  const isSocialAuthEnabled =
    isSocialLoginGoogleEnabled || isSocialLoginFacebookEnabled;
  // If no social auth enabled we skip to sign in with email page
  const [showSocialAuthScreen, setShowSocialAuthScreen] = React.useState(
    isSocialAuthEnabled,
  );
  const [isFormLoading, setIsFormLoading] = React.useState(false);

  const title = translate(keys.title, 'Log In');
  const submitButtonLabel = translate(keys.submitButton, 'Log In');
  const switchDialogLink = translate(keys.switchDialogLink, 'Sign Up');
  const switchToSignUp = translate(keys.switchToSignUp, 'New to this site?');
  const emailSectionDivider = translate(keys.emailSectionDivider, 'or');
  const switchToAuthWithEmail = translate(
    keys.switchToAuthWithEmail,
    'Log in with Email',
  );
  const socialSectionDividerLabel = translate(
    keys.socialSectionDivider,
    'or log in with',
  );
  const presentedAuthMethodScreen = showSocialAuthScreen ? (
    <SocialAuth
      id={id}
      emailSectionDivider={emailSectionDivider}
      switchToAuthWithEmail={switchToAuthWithEmail}
      goToEmailAuthScreen={setShowSocialAuthScreen}
      enabledSocialVendors={enabledSocialVendors}
      iframeConfig={iframeConfig}
      style={style}
      isEmailLoginEnabled={isEmailLoginEnabled}
      mode="login"
      translate={translate}
    />
  ) : (
    <EmailAuth
      id={id}
      translate={translate}
      onForgetYourPasswordClick={onForgetYourPasswordClick}
      onSubmitStart={() => setIsFormLoading(true)}
      onSubmitEnd={() => setIsFormLoading(false)}
      submit={submit}
      style={style}
      mode="login"
      submitButtonLabel={submitButtonLabel}
    />
  );

  return (
    <SiteMembersDialogLayout
      isCloseable={isCloseable}
      translate={props.translate}
      onCloseDialogCallback={onCloseDialogCallback}
      headlineId={headlineId}
      displayMode={displayMode}
      dialogPosition="start"
    >
      <div
        id={id}
        className={classnames(style.memberLoginContent, {
          [style.formLoading]: isFormLoading,
        })}
      >
        <h1 id={headlineId} className={style.title}>
          {title}
        </h1>
        <div
          className={classnames(style.contentWrapper, style.wrapper, {
            [style.horizontal]: isSocialAuthEnabled,
            [style.socialLoginMode]: showSocialAuthScreen,
            [style.vertical]: !isSocialAuthEnabled,
            [style.emailLoginMode]: !showSocialAuthScreen,
          })}
        >
          <div className={style.switchToSignUpContainer}>
            <span
              data-testid="switchToSignUpDescription"
              className={style.switchToSignUpText}
            >
              {switchToSignUp}
            </span>
            <button
              className={style.switchDialogLink}
              data-testid="switchToSignUp"
              onClick={onSwitchDialogLinkClick}
              onKeyDown={activateByEnterButton}
              autoFocus
              type="button"
            >
              {switchDialogLink}
            </button>
          </div>
          {presentedAuthMethodScreen}
          {isSocialAuthEnabled && (
            <div
              className={classnames({
                [style.hideAuthMethod]: showSocialAuthScreen,
              })}
            >
              <SmallSocialIcons
                socialSectionDivider={socialSectionDividerLabel}
                enabledSocialVendors={enabledSocialVendors}
                iframeConfig={iframeConfig}
                style={style}
                translate={translate}
                mode="login"
              />
            </div>
          )}
        </div>
      </div>
      <div className={style.preloaderContainer}>
        <Preloader enabled={isFormLoading} dark={true} />
      </div>
    </SiteMembersDialogLayout>
  );
};

export default MemberLoginDialog;
