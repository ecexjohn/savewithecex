import * as React from 'react';
import { TestIds } from '../constants';
import { LinkProps } from '../Link.types';
import { activateBySpaceButton } from '../../../core/commons/a11y';

const Link: React.FC<LinkProps> = ({
  href,
  target,
  rel,
  className = '',
  children,
  linkPopupId,
  anchorDataId,
  anchorCompId,
  'aria-label': ariaLabel,
  'aria-haspopup': ariaHasPopup,
  'aria-labelledby': ariaLabelledBy,
  tabIndex,
  dataTestId = TestIds.root,
  title,
  activateBySpaceButton: shouldActivateBySpaceButton = true,
}) => {
  return href !== undefined ? (
    // eslint-disable-next-line jsx-a11y/role-supports-aria-props
    <a
      data-testid={dataTestId}
      data-popupid={linkPopupId}
      data-anchor={anchorDataId}
      data-anchor-comp-id={anchorCompId}
      href={href}
      target={target}
      rel={rel}
      className={className}
      onKeyDown={
        shouldActivateBySpaceButton ? activateBySpaceButton : undefined
      }
      aria-label={ariaLabel}
      aria-haspopup={ariaHasPopup}
      aria-labelledby={ariaLabelledBy}
      title={title}
    >
      {children}
    </a>
  ) : (
    <div
      data-testid={dataTestId}
      className={className}
      tabIndex={tabIndex}
      aria-haspopup={ariaHasPopup}
      title={title}
    >
      {children}
    </div>
  );
};

export default Link;
