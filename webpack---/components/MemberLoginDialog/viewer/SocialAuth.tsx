import * as React from 'react';
import classnames from 'classnames';
import BasicButton from '../../SiteButton/viewer/skinComps/BaseButton/BasicButton.skin';
import { ISocialAuthLogin, ISocialIcons } from '../MemberLoginDialog.types';
import Preloader from '../../Preloader/viewer/Preloader';
import { serializeIframeSource } from './SmallSocialIcons';
import { MemberLoginDialogTranslationKeys as keys } from './constants';

export const SocialAuth: React.FC<ISocialAuthLogin> = ({
  id,
  emailSectionDivider,
  switchToAuthWithEmail,
  enabledSocialVendors,
  iframeConfig,
  goToEmailAuthScreen,
  isEmailLoginEnabled,
  style,
  mode,
  translate,
}) => {
  return (
    <>
      <div className={style.socialLoginWrapper}>
        <SocialIcons
          enabledSocialVendors={enabledSocialVendors}
          iframeConfig={iframeConfig}
          style={style}
          mode={mode}
          translate={translate}
        />
      </div>

      {isEmailLoginEnabled && (
        <>
          <div
            className={classnames(
              style.emailSectionDivider,
              style.sectionDivider,
            )}
          >
            <span className={style.emailSectionDividerText}>
              {emailSectionDivider}
            </span>
          </div>
          <div data-testid="switchToEmailLink" className={style.expandButton}>
            <BasicButton
              label={switchToAuthWithEmail}
              data-testid="switchToEmailLink"
              id={`switchToEmailLink_${id}`}
              isDisabled={false}
              hasPlatformClickHandler={true}
              link={undefined}
              onClick={() => goToEmailAuthScreen(false)}
            />
          </div>
        </>
      )}
    </>
  );
};

export const SocialIcons: React.FC<Omit<
  ISocialIcons,
  'socialSectionDivider'
>> = ({ enabledSocialVendors, iframeConfig, style, mode, translate }) => {
  const src = serializeIframeSource(
    { ...iframeConfig, enabledSocialVendors, mode },
    false,
  );
  const height = Array.from(enabledSocialVendors).length * 75 + 'px';

  const [isSocialIframeLoaded, setSocialIframeLoaded] = React.useState(false);

  const socialLoginIframeClass = classnames(style.socialLoginIframe, {
    [style.ready]: isSocialIframeLoaded,
  });
  const title = translate(keys.social.iframeTitle, 'Social login');

  return (
    <div className={style.socialLoginWrapper}>
      <iframe
        data-testid="socialAuthIframe"
        src={src}
        className={socialLoginIframeClass}
        title={title}
        frameBorder="0"
        scrolling="no"
        style={{ height }}
        onLoad={() => setSocialIframeLoaded(true)}
      />
      <Preloader enabled={!isSocialIframeLoaded} dark={true} />
      <p className={style.socialLoginErrorMsg}></p>
    </div>
  );
};
