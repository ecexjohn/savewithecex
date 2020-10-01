import classNames from 'classnames';
import * as React from 'react';
import { NavigationDotButtonsProps } from '../SlideShowContainer.types';
import { translations } from '../constants';
import styles from './style/SlideShowContainer.scss';

const NavigationDotButtons: React.FC<NavigationDotButtonsProps> = ({
  translate,
  currentSlideIndex,
  slidesProps,
  isPlaying,
  focusSlideShow,
  changeSlide,
}) => {
  const getNavigationDotListItem = (
    slide: NavigationDotButtonsProps['slidesProps'][number],
    slideIndex: number,
  ) => {
    const anchorClickHandler = (event: React.MouseEvent) => {
      event.preventDefault();
      event.stopPropagation();

      if (slideIndex !== currentSlideIndex) {
        changeSlide(slideIndex);
      }

      if (!isPlaying) {
        focusSlideShow();
      }
    };

    return (
      <li
        key={slide.id}
        aria-current={slideIndex === currentSlideIndex ? 'true' : undefined}
      >
        {/* eslint-disable-next-line jsx-a11y/anchor-has-content */}
        <a
          href={`./#${slide.id}`}
          aria-label={slide.title}
          onClick={anchorClickHandler}
          className={classNames(styles.navDot, {
            [styles.selected]: slideIndex === currentSlideIndex,
          })}
        />
      </li>
    );
  };

  return (
    <nav
      aria-label={translate!(
        translations.ARIA_LABEL_NAMESPACE,
        translations.NAVIGATION_DOTS_ARIA_LABEL_KEY,
        translations.NAVIGATION_DOTS_ARIA_LABEL_DEFAULT,
      )}
      className={styles.dotsNavSection}
    >
      <ol className={styles.dotsNavList}>
        {slidesProps.map((slide, slideIndex) =>
          getNavigationDotListItem(slide, slideIndex),
        )}
      </ol>
    </nav>
  );
};

export default NavigationDotButtons;
