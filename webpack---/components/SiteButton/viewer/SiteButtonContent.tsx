import React, { ComponentType, ReactNode } from 'react';
import Link from '../../Link/viewer/Link';
import { TestIds, ElementType } from '../constants';
import { SkinButtonProps } from './skinComps/SkinButton';

export type SiteButtonContentCompProps = {
  linkProps: SkinButtonProps['linkProps'];
  elementType: SkinButtonProps['elementType'];
  className: string;
  children: ReactNode;
};

const SiteButtonContent: ComponentType<SiteButtonContentCompProps> = ({
  elementType,
  linkProps,
  className,
  children,
}) => {
  switch (elementType) {
    case ElementType.Link:
      return (
        <Link {...(linkProps || {})} className={className}>
          {children}
        </Link>
      );
    case ElementType.Button:
      return (
        <button data-testid={TestIds.buttonElement} className={className}>
          {children}
        </button>
      );
    default:
      return null;
  }
};

export default SiteButtonContent;
