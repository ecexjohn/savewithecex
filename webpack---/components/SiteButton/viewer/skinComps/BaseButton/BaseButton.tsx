import * as React from 'react';
import SiteButtonContent from '../../SiteButtonContent';
import { SkinButtonProps } from '../SkinButton';

type BaseButtonSkinProps = SkinButtonProps & {
  skinsStyle: Record<string, string>;
};

const BaseButtonSkin: React.FC<BaseButtonSkinProps> = ({
  wrapperProps,
  linkProps,
  elementType,
  skinsStyle,
  label,
}) => {
  return (
    <div {...wrapperProps} className={skinsStyle.root}>
      <SiteButtonContent
        linkProps={linkProps}
        elementType={elementType}
        className={skinsStyle.link}
      >
        <span className={skinsStyle.label}>{label}</span>
      </SiteButtonContent>
    </div>
  );
};

export default BaseButtonSkin;
