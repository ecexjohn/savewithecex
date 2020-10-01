import * as React from 'react';
import { ElementType } from '../constants';
import { ISiteButtonProps } from '../SiteButton.types';

const getTabIndex = (
  elementType: ElementType,
  link: ISiteButtonProps['link'],
  isDisabled: boolean,
) => {
  if (isDisabled) {
    return -1;
  }

  if (elementType === ElementType.Button) {
    return undefined;
  }

  if (isEmptyLink(elementType, link)) {
    return 0;
  }

  return undefined;
};

const getRole = (
  elementType: ElementType,
  link: ISiteButtonProps['link'],
  isDisabled: boolean,
) => (isEmptyLink(elementType, link) || isDisabled ? 'button' : undefined);

const isEmptyLink = (
  elementType: ElementType,
  link: ISiteButtonProps['link'],
) => elementType === ElementType.Link && (!link || !link.href);

const SiteButton: React.FC<ISiteButtonProps> = ({
  id,
  label = '',
  skin: ButtonClass,
  isDisabled = false,
  hasPlatformClickHandler = false,
  link = undefined,
  onClick = () => ({}),
  onDblClick = () => ({}),
  onMouseEnter = () => ({}),
  onMouseLeave = () => ({}),
}) => {
  // TODO - this is a temp workaround for SSR setting isDisabled value as `null`
  if (isDisabled !== true) {
    isDisabled = false;
  }

  const elementType = hasPlatformClickHandler
    ? ElementType.Button
    : ElementType.Link;

  const tabIndex = getTabIndex(elementType, link, isDisabled);
  const role = getRole(elementType, link, isDisabled);

  const linkProps = link && {
    href: isDisabled ? undefined : link.href,
    target: link.target,
    rel: link.rel,
    linkPopupId: link.linkPopupId,
    anchorDataId: link.anchorDataId,
    anchorCompId: link.anchorCompId,
  };

  return (
    <ButtonClass
      wrapperProps={{
        id,
        role,
        tabIndex,
        'aria-disabled': isDisabled,
        onClick: isDisabled ? () => {} : onClick,
        onDoubleClick: isDisabled ? () => {} : onDblClick,
        onMouseEnter,
        onMouseLeave,
      }}
      elementType={elementType}
      linkProps={linkProps}
      label={label}
    />
  );
};

export default SiteButton;
