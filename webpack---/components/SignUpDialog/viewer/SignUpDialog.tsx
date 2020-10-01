import * as React from 'react';
import classnames from 'classnames';
import { ISignUpDialogProps } from '../SignUpDialog.types';
import {
  IIFrameConfig,
  ISocialVendors,
} from '../../MemberLoginDialog/MemberLoginDialog.types';
import { activateByEnterButton } from '../../../core/commons/a11y';
import { SocialAuth } from '../../MemberLoginDialog/viewer/SocialAuth';
import { EmailAuth } from '../../MemberLoginDialog/viewer/EmailAuth';
import SiteMembersDialogLayout from '../../SiteMembersDialogLayout/viewer/SiteMembersDialogLayout';
import { useAuthIframeSubscription } from '../../MemberLoginDialog/viewer/useAuthIframeSubscription';
import { SmallSocialIcons } from '../../MemberLoginDialog/viewer/SmallSocialIcons';
import { Community } from './Community';
import { Policies } from './Policies';
import style from './style/style.scss';
import {
  translationFeature,
  SignUpDialogTranslationKeys as keys,
  testIds,
} from './constants';

const SignUpDialog: React.FC<ISignUpDialogProps> = props => {
  const {
    id,
    isSocialLoginGoogleEnabled,
    isSocialLoginFacebookEnabled,
    isEmailLoginEnabled,
    submit,
    onSwitchDialogLinkClick,
    language,
    biVisitorId,
    smCollectionId,
    svSession,
    metaSiteId,
    isCommunityInstalled,
    isPrivacyPolicyNeeded,
    isTermsOfUseNeeded,
    isCodeOfConductNeeded,
    codeOfConductLink,
    privacyPolicyLink,
    termsOfUseLink,
    onCloseDialogCallback,
    isCloseable,
    joinCommunityCheckedByDefault,
    onTokenMessage,
    onBackendSocialLogin,
    reportBi,
    displayMode,
  } = props;
  const translate = props.translate!.bind(null, translationFeature);
  const [isCommunityChecked, setCommunityChecked] = React.useState<boolean>(
    joinCommunityCheckedByDefault,
  );

  const headlineId = `signUpHeadline_${id}`;

  useAuthIframeSubscription(
    onTokenMessage,
    onBackendSocialLogin,
    reportBi,
    displayMode,
    isCommunityChecked,
  );

  const iframeConfig: IIFrameConfig = {
    language,
    biVisitorId,
    smCollectionId,
    svSession,
    metaSiteId,
    isCommunityChecked,
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
  // If no social auth enabled we skip to sign up with email page
  const [showSocialAuthScreen, setShowSocialAuthScreen] = React.useState(
    isSocialAuthEnabled,
  );
  const [isFormLoading, setIsFormLoading] = React.useState(false);

  const title = translate(keys.title, 'Sign Up');
  const submitButtonLabel = translate(keys.submitButton, 'Sign Up');
  const switchDialogLink = translate(keys.switchDialogLink, 'Log In');
  const switchToSignUp = translate(keys.switchToSignIn, 'Already a member?');
  const emailSectionDivider = translate(keys.emailSectionDivider, 'or');
  const switchToAuthWithEmail = translate(
    keys.switchToAuthWithEmail,
    'Sign up with Email',
  );
  const socialSectionDividerLabel = translate(
    keys.socialSectionDivider,
    'or sign up with',
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
      mode="signup"
      isEmailLoginEnabled={isEmailLoginEnabled}
      translate={translate}
    />
  ) : (
    <EmailAuth
      id={id}
      translate={translate}
      onSubmitStart={() => setIsFormLoading(true)}
      onSubmitEnd={() => setIsFormLoading(false)}
      submit={submit}
      style={style}
      mode="signup"
      submitButtonLabel={submitButtonLabel}
      isCommunityChecked={isCommunityChecked}
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
        <h1
          id={`signUpHeadline_${id}`}
          className={style.title}
          data-testid={testIds.headline}
        >
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
              data-testid={testIds.switchToSignUp.description}
              className={style.switchToSignUpText}
            >
              {switchToSignUp}
            </span>
            <button
              className={style.switchDialogLink}
              data-testid={testIds.switchToSignUp.title}
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
                mode="signup"
              />
            </div>
          )}
        </div>
        <div className={style.formFooter}>
          {isCommunityInstalled && (
            <Community
              checked={isCommunityChecked}
              setChecked={setCommunityChecked}
              translate={translate}
              isCodeOfConductNeeded={isCodeOfConductNeeded}
              codeOfConductLink={codeOfConductLink}
              onCloseDialogCallback={onCloseDialogCallback}
            />
          )}
          {(isPrivacyPolicyNeeded || isTermsOfUseNeeded) && (
            <Policies
              translate={translate}
              isPrivacyPolicyNeeded={isPrivacyPolicyNeeded}
              isTermsOfUseNeeded={isTermsOfUseNeeded}
              termsOfUseLink={termsOfUseLink}
              privacyPolicyLink={privacyPolicyLink}
              onCloseDialogCallback={onCloseDialogCallback}
            />
          )}
        </div>
      </div>
      <div
        className={classnames(style.preloader, style.circlePreloader, {
          [style.formLoading]: isFormLoading,
        })}
      />
    </SiteMembersDialogLayout>
  );
};

export default SignUpDialog;
