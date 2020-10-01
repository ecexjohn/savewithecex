import React, { FunctionComponent } from 'react';
import classNames from 'classnames';
import { MediaContainerCompProps } from '../MediaContainer.types';
import MeshContainer from '../../../thunderbolt-core-components/MeshContainer/viewer/MeshContainer';
import FillLayers from '../../FillLayers/viewer/FillLayers';
import styles from './style/MediaContainer.scss';

const noop = () => {};

const MediaContainer: FunctionComponent<MediaContainerCompProps> = ({
  id,
  fillLayers,
  children,
  meshProps,
  onClick = noop,
  onDblClick = noop,
  onMouseEnter = noop,
  onMouseLeave = noop,
}) => {
  // fix content in front of background in position:fixed disappearing when scrolling to it - Chromium +85 bug
  const shouldFixFlashingContent = fillLayers.hasBgFullscreenScrollEffect;

  return (
    <div
      id={id}
      className={styles.mediaContainer}
      onClick={onClick}
      onDoubleClick={onDblClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <FillLayers {...fillLayers} />
      <MeshContainer
        id={id}
        {...meshProps}
        extraClassName={classNames({
          [styles.fixFlashingContent]: shouldFixFlashingContent,
        })}
      >
        {children}
      </MeshContainer>
    </div>
  );
};

export default MediaContainer;
