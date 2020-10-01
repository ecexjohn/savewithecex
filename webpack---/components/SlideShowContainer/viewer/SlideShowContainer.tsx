import classNames from 'classnames';
import * as React from 'react';
import {
  ISlideShowContainerImperativeActions,
  SlideShowContainerProps,
} from '../SlideShowContainer.types';
import { translations, TestIds, NO_TRANSITION } from '../constants';
import { PauseEvent, PlayEvent } from '../../../core/corvid/props-factories';
import { useInterval } from '../../../providers/useInterval/useInterval';
import { useInViewport } from '../../../providers/useInViewport/useInViewport';
import { useGesture } from '../../../providers/useGesture/useGesture';
import styles from './style/SlideShowContainer.scss';
import NavigationButtons from './NavigationButtons';
import DotsNavigationButtons from './NavigationDotButtons';
import Slides from './Slides';

const SlideShowContainer: React.ForwardRefRenderFunction<
  ISlideShowContainerImperativeActions,
  SlideShowContainerProps
> = (
  {
    id,
    skin,
    hasShadowLayer,
    translate,
    currentSlideIndex,
    slidesProps,
    autoPlay,
    autoPlayInterval,
    pauseAutoPlayOnMouseOver,
    transition,
    transitionDuration,
    transitionReverse,
    changeSlide,
    reduceMotion,
    children,
    onCurrentSlideChanged,
    onChange,
    onMouseEnter,
    onMouseLeave,
    onClick,
    onDblClick,
    play,
    onPlay,
    pause,
    onPause,
    // defaults to canAutoPlay logic for initial value
    isPlaying = autoPlay &&
      React.Children.toArray(children()).length > 1 &&
      !reduceMotion,
  },
  ref,
) => {
  const [reverseByNavigation, setReverseByNavigation] = React.useState(false);
  const [inTransition, setInTransition] = React.useState(false);

  const hasTransition = transition !== NO_TRANSITION;
  const setBackwardDirection = () => setReverseByNavigation(true);
  const setForwardDirection = () => setReverseByNavigation(false);
  const reverse = transitionReverse
    ? !reverseByNavigation
    : reverseByNavigation;

  const childrenArray = React.Children.toArray(children());
  const canAutoPlay = autoPlay && childrenArray.length > 1 && !reduceMotion;

  const moveToSlide = React.useCallback(
    (slideIndex: number, isBackward?: boolean) => {
      if (inTransition) {
        return;
      }

      if (hasTransition) {
        setInTransition(true);

        const isNavigationByDotButton = isBackward === undefined;
        const isBackwardDirection = isNavigationByDotButton
          ? slideIndex < currentSlideIndex
          : isBackward;
        if (isBackwardDirection) {
          setBackwardDirection();
        } else {
          setForwardDirection();
        }
      }

      changeSlide(slideIndex);

      onChange?.({ type: 'change' } as React.ChangeEvent);

      // if we have no transition animation on slide change, trigger slide
      // changed instantly
      if (!hasTransition) {
        onCurrentSlideChanged?.(slideIndex);
      }
    },
    [
      changeSlide,
      currentSlideIndex,
      hasTransition,
      inTransition,
      onChange,
      onCurrentSlideChanged,
    ],
  );

  const moveToNextSlide = React.useCallback(() => {
    const newSlideIndex =
      currentSlideIndex === childrenArray.length - 1
        ? 0
        : currentSlideIndex + 1;

    return moveToSlide(newSlideIndex, false);
  }, [childrenArray.length, currentSlideIndex, moveToSlide]);

  const moveToPrevSlide = React.useCallback(() => {
    const newSlideIndex =
      currentSlideIndex === 0
        ? childrenArray.length - 1
        : currentSlideIndex - 1;

    return moveToSlide(newSlideIndex, true);
  }, [childrenArray.length, currentSlideIndex, moveToSlide]);

  const _onMouseEnter =
    canAutoPlay && pauseAutoPlayOnMouseOver
      ? (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
          pause();
          onMouseEnter?.(event);
        }
      : onMouseEnter;

  const _onMouseLeave =
    canAutoPlay && pauseAutoPlayOnMouseOver
      ? (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
          play();
          onMouseLeave?.(event);
        }
      : onMouseLeave;
  const focusListeners = canAutoPlay
    ? {
        onFocus: () => pause(),
        onBlur: () => play(),
      }
    : {};

  const slideShowRef = React.useRef<HTMLDivElement>(null);
  const isSlideShowInViewport = useInViewport(slideShowRef);

  useGesture('onSwipeLeft', moveToNextSlide, slideShowRef);
  useGesture('onSwipeRight', moveToPrevSlide, slideShowRef);

  useInterval(
    moveToNextSlide,
    isPlaying && isSlideShowInViewport ? autoPlayInterval : null,
  );

  React.useImperativeHandle(
    ref,
    () => {
      return {
        play: () => {
          play();
          onPlay?.({ type: 'autoplayOn' } as PlayEvent);
        },
        pause: () => {
          pause();
          onPause?.({ type: 'autoplayOff' } as PauseEvent);
        },
        moveToSlide,
        next: moveToNextSlide,
        previous: moveToPrevSlide,
      };
    },
    [
      moveToNextSlide,
      moveToPrevSlide,
      moveToSlide,
      onPause,
      onPlay,
      pause,
      play,
    ],
  );

  return (
    <div
      id={id}
      ref={slideShowRef}
      className={classNames(
        styles.slideShowContainer,
        styles[skin],
        'ignore-focus',
      )}
      role="region"
      tabIndex={-1}
      aria-label={translate!(
        translations.ARIA_LABEL_NAMESPACE,
        translations.SLIDE_SHOW_ARIA_LABEL_KEY,
        translations.SLIDE_SHOW_ARIA_LABEL_DEFAULT,
      )}
      onClick={onClick}
      onDoubleClick={onDblClick}
      onMouseEnter={_onMouseEnter}
      onMouseLeave={_onMouseLeave}
      {...focusListeners}
    >
      <NavigationButtons
        skin={skin}
        translate={translate}
        moveToNextSlide={moveToNextSlide}
        moveToPrevSlide={moveToPrevSlide}
      />
      {hasShadowLayer && (
        <div data-testid={TestIds.shadowLayer} className={styles.shadowLayer} />
      )}
      <Slides
        isPlaying={isPlaying}
        isSlideShowInViewport={isSlideShowInViewport}
        reverse={reverse}
        transition={reduceMotion ? NO_TRANSITION : transition}
        transitionDuration={transitionDuration}
        currentSlideIndex={currentSlideIndex}
        onSlideEntered={() => {
          if (!hasTransition) {
            return;
          }
          setInTransition(false);
        }}
        onSlideExited={() => {
          // trigger slide changed handlers at the end of the transition
          onCurrentSlideChanged?.(currentSlideIndex);
        }}
      >
        {childrenArray[currentSlideIndex]}
      </Slides>
      <DotsNavigationButtons
        focusSlideShow={() => slideShowRef.current?.focus()}
        translate={translate}
        slidesProps={slidesProps}
        currentSlideIndex={currentSlideIndex}
        changeSlide={moveToSlide}
      />
    </div>
  );
};

export default React.forwardRef(SlideShowContainer);
