import * as React from 'react';
import classNames from 'classnames';
import {
  IElementPropsSDKActions,
  IClickPropsSDKActions,
} from '../../../core/corvid/props-factories';
import styles from './WPhotoWrapper.scss';

type WPhotoWrapperProps = {
  id: string;
  className: string;
  title?: string;
  withOnClickHandler: boolean;
} & Partial<IElementPropsSDKActions> &
  Partial<IClickPropsSDKActions>;

export const WPhotoWrapper: React.FC<WPhotoWrapperProps> = props => {
  const {
    id,
    children,
    className,
    title,
    onClick,
    onDblClick,
    withOnClickHandler,
    onMouseEnter,
    onMouseLeave,
  } = props;
  const withOnClickHandlerClass = withOnClickHandler
    ? styles.withOnClickHandler
    : '';

  return (
    <div
      id={id}
      className={classNames(className, withOnClickHandlerClass)}
      title={title}
      onClick={onClick}
      onDoubleClick={onDblClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {children}
    </div>
  );
};
