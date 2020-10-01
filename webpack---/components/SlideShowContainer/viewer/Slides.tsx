import { TransitionGroup } from 'react-transition-group';
import * as React from 'react';
import Transition from '../../Transition/Transition';
import { SlidesProps } from '../SlideShowContainer.types';
import { TestIds } from '../constants';
import styles from './style/SlideShowContainer.scss';

const Slides: React.FC<SlidesProps> = ({
  isPlaying,
  isSlideShowInViewport,
  reverse,
  transition,
  transitionDuration,
  currentSlideIndex,
  onSlideEntered,
  onSlideExited,
  children,
}) => {
  const ariaLive =
    !isSlideShowInViewport || (isPlaying && isSlideShowInViewport)
      ? 'off'
      : 'polite';
  return transition === 'NoTransition' ? (
    <div
      data-testid={TestIds.slidesWrapper}
      className={styles.slides}
      aria-live={ariaLive}
    >
      {children}
    </div>
  ) : (
    <TransitionGroup
      data-testid={TestIds.slidesWrapper}
      aria-live={ariaLive}
      className={styles.slides}
      childFactory={child => React.cloneElement(child, { reverse })}
    >
      <Transition
        type={transition}
        key={currentSlideIndex}
        timeout={transitionDuration}
        onEntered={onSlideEntered}
        onExited={onSlideExited}
        unmountOnExit
      >
        {children}
      </Transition>
    </TransitionGroup>
  );
};

export default Slides;
