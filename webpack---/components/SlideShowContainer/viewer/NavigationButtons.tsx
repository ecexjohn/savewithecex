import classNames from 'classnames';
import { SlideShowSkin } from '@wix/thunderbolt-components-native';
import * as React from 'react';
import { NavigationButtonsProps } from '../SlideShowContainer.types';
import { translations, TestIds } from '../constants';
import styles from './style/SlideShowContainer.scss';
import { ReactComponent as thinArrowSVG } from './assets/thinArrow.svg';
import { ReactComponent as longArrowSVG } from './assets/longArrow.svg';
import { ReactComponent as squareButtonSVG } from './assets/squareButton.svg';

const skinToArrowSVGs: Record<SlideShowSkin, React.FC> = {
  thinArrowsSkin: thinArrowSVG,
  thinArrowsLargeSelectedCircleSkin: thinArrowSVG,
  longArrowsLargeSelectedCircleSkin: longArrowSVG,
  squareButtonsSkin: squareButtonSVG,
};

const NavigationButtons: React.FC<NavigationButtonsProps> = ({
  skin,
  moveToNextSlide,
  moveToPrevSlide,
  translate,
}) => {
  const NavButtonSVG = skinToArrowSVGs[skin];

  return (
    <React.Fragment>
      <button
        data-testid={TestIds.prevButton}
        aria-label={translate!(
          translations.ARIA_LABEL_NAMESPACE,
          translations.PREV_BTN_ARIA_LABEL_KEY,
          translations.PREV_BTN_ARIA_LABEL_DEFAULT,
        )}
        onClick={moveToPrevSlide}
        className={classNames(styles.navBtn, styles.prevBtn)}
      >
        <NavButtonSVG />
      </button>
      <button
        data-testid={TestIds.nextButton}
        aria-label={translate!(
          translations.ARIA_LABEL_NAMESPACE,
          translations.NEXT_BTN_ARIA_LABEL_KEY,
          translations.NEXT_BTN_ARIA_LABEL_DEFAULT,
        )}
        onClick={moveToNextSlide}
        className={classNames(styles.navBtn, styles.nextBtn)}
      >
        <NavButtonSVG />
      </button>
    </React.Fragment>
  );
};

export default NavigationButtons;
