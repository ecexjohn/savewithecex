import * as React from 'react';
import classnames from 'classnames';
import {
  IIFrameConfig,
  IMode,
  IPrivacyStatus,
  ISocialIcons,
  ISocialVendors,
} from '../MemberLoginDialog.types';
import Preloader from '../../Preloader/viewer/Preloader';
import { MemberLoginDialogTranslationKeys as keys } from './constants';

export const SmallSocialIcons: React.FC<ISocialIcons> = ({
  socialSectionDivider,
  enabledSocialVendors,
  iframeConfig,
  style,
  mode,
  translate,
}) => {
  const src = serializeIframeSource(
    { ...iframeConfig, enabledSocialVendors, mode },
    true,
  );
  const [isSocialIframeLoaded, setSocialIframeLoaded] = React.useState(false);
  const title = translate(keys.social.iframeTitle, 'Social login');
  const socialLoginIframeClass = classnames(style.socialLoginIframeHorizontal, {
    [style.ready]: isSocialIframeLoaded,
  });
  return (
    <>
      <div
        className={classnames(
          style.socialSectionDivider, // Maybe we can remove this one
          style.sectionDivider,
        )}
      >
        <span>{socialSectionDivider}</span>
      </div>
      <div className={style.socialLoginWrapper}>
        <iframe
          data-testid="socialAuthIframe"
          src={src}
          className={socialLoginIframeClass}
          title={title}
          frameBorder="0"
          scrolling="no"
          onLoad={() => setSocialIframeLoaded(true)}
        />
        <Preloader enabled={!isSocialIframeLoaded} dark={true} />
        <p className={style.socialLoginErrorMsg}></p>
      </div>
    </>
  );
};

export const serializeIframeSource = (
  iframeConfig: IIFrameConfig & {
    enabledSocialVendors: Set<ISocialVendors>;
    mode: IMode;
  },
  isHorizontal: boolean,
) => {
  const params = {
    mode: iframeConfig.mode,
    lang: iframeConfig.language,
    vendors: Array.from(iframeConfig.enabledSocialVendors).join(','),
    extraCss: classnames('svg-style', { horizontal: isHorizontal }),
    visitorId: iframeConfig.biVisitorId,
    collectionId: iframeConfig.smCollectionId,
    svSession: iframeConfig.svSession,
    useGoogleSdk: iframeConfig.useGoogleSdk?.toString(),
  };
  const paramsString = new URLSearchParams(params).toString();
  const siteMembersUrl = 'https://users.wix.com/wix-sm';
  const privacyStatus = getPrivacyStatus(iframeConfig.isCommunityChecked);
  const templatePathUrl = `${siteMembersUrl.replace(
    /^(https|http):/i,
    '',
  )}/view/social/frame/${iframeConfig.metaSiteId}`;
  return `${templatePathUrl}?${paramsString}#privacyStatus=${privacyStatus}`;
};

export const getPrivacyStatus = (
  isJoinCommunityChecked: boolean,
): IPrivacyStatus => {
  return isJoinCommunityChecked ? 'PUBLIC' : 'PRIVATE';
};
