import React, { useState } from 'react';

import MeshContainer from '../../../thunderbolt-core-components/MeshContainer/viewer/MeshContainer';
import { IHeaderContainerProps } from '../HeaderContainer.types';
import { useScrollPosition } from '../../../providers/useScrollPosition';

const ScrollDirection = {
  up: 'up',
  down: 'down',
} as const;

const getTriggerPositionByAnimationName = (animation: string) => {
  switch (animation) {
    case 'HeaderFadeOut':
      return 200;
    case 'HeaderHideToTop':
      return 400;
    default:
      return null;
  }
};

const HeaderContainer: React.FC<IHeaderContainerProps> = props => {
  const {
    id,
    skin: HeaderContainerClass,
    children,
    animations,
    meshProps,
  } = props;

  const sdkEventHandlers = {
    onMouseEnter: props.onMouseEnter,
    onMouseLeave: props.onMouseLeave,
    onClick: props.onClick,
    onDoubleClick: props.onDblClick,
  };

  const [animationProp, setAnimationProp] = useState<string>('');
  let direction: typeof ScrollDirection[keyof typeof ScrollDirection] =
    ScrollDirection.down;
  let directionFlipPosition = 0;

  useScrollPosition(
    ({ currPos, prevPos }) => {
      const currentPosition = currPos.y * -1;
      const prevPosition = prevPos.y * -1;

      animations!.forEach(animationObject => {
        // until TB will fix the type
        // @ts-ignore
        animationObject.params.animations.forEach(animation => {
          const triggerPosition = getTriggerPositionByAnimationName(
            animation.name,
          );
          if (triggerPosition) {
            if (
              direction === ScrollDirection.down &&
              currentPosition < prevPosition
            ) {
              directionFlipPosition = prevPosition;
              direction = ScrollDirection.up;
            } else if (
              direction === ScrollDirection.up &&
              currentPosition > prevPosition
            ) {
              directionFlipPosition = prevPosition;
              direction = ScrollDirection.down;
            }

            if (animation.name === animationProp) {
              if (
                direction === ScrollDirection.up &&
                currentPosition + triggerPosition < directionFlipPosition
              ) {
                setAnimationProp(animation.name + 'Reverse');
              }
            } else if (
              direction === ScrollDirection.down &&
              currentPosition - directionFlipPosition >= triggerPosition
            ) {
              setAnimationProp(animation.name);
            }
          }
        });
      });
    },
    [animationProp],
    { disabled: !animations || !animations.length },
  );

  return (
    <HeaderContainerClass
      wrapperProps={{ id, tagName: 'header', eventHandlers: sdkEventHandlers }}
      animation={animationProp}
    >
      <MeshContainer id={id} {...meshProps} children={children} />
    </HeaderContainerClass>
  );
};

export default HeaderContainer;
