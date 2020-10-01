import React, { KeyboardEvent } from 'react';
import { ISiteMembersDialogLayoutProps } from '../SiteMembersDialogLayout.types';
import { keyCodes } from '../../../core/commons/a11y';
import { ReactComponent as Close } from './assets/close.svg';
import style from './style/style.scss';

const SiteMembersDialogLayout: React.FC<ISiteMembersDialogLayoutProps> = props => {
  const {
    isCloseable,
    children,
    translate,
    onCloseDialogCallback,
    headlineId,
    displayMode = 'fullscreen',
    dialogPosition = 'center',
  } = props;

  const closeOnEscapeClick = (event: KeyboardEvent): void => {
    if (event.keyCode === keyCodes.escape) {
      onCloseDialogCallback();
    }
  };

  return (
    <div
      className={style.dialog}
      onKeyDown={closeOnEscapeClick}
      data-testid="siteMembersDialogLayout"
      data-layout={displayMode}
    >
      <div
        className={style.blockingLayer}
        onClick={onCloseDialogCallback}
        data-testid="siteMembersDialogBlockingLayer"
      />
      <div
        role="dialog"
        tabIndex={-1}
        aria-labelledby={headlineId}
        className={style.content}
        data-dialogposition={dialogPosition}
      >
        {isCloseable && (
          <button
            className={style.xButton}
            onClick={onCloseDialogCallback}
            data-testid="xButton"
            aria-label={translate!(
              'dialogMixinTranslations',
              'dialogMixinTranslations_Close_Dialog',
              'close dialog',
            )}
            type="button"
          >
            <Close />
          </button>
        )}
        {children}
      </div>
    </div>
  );
};

export default SiteMembersDialogLayout;
