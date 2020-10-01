import * as React from 'react';
import classNames from 'classnames';
import Image from '../../Image/viewer/Image';
import BackgroundImage from '../../BackgroundImage/viewer/BackgroundImage';
import Video from '../../Video/viewer/Video';
import BackgroundMedia from '../../BackgroundMedia/viewer/BackgroundMedia';
import BackgroundOverlay from '../../BackgroundOverlay/viewer/BackgroundOverlay';
import { FillLayersProps } from '../FillLayers.types';
import { TestIds } from '../constants';
import styles from './style/FillLayers.scss';

const IMAGE_CLASS_FOR_LAYOUT = 'bgImage';

const FillLayers: React.FC<FillLayersProps> = props => {
  const {
    videoRef,
    containerId,
    hasBgFullscreenScrollEffect,
    image,
    backgroundImage,
    backgroundMedia,
    video,
    backgroundOverlay,
    shouldPadMedia,
    extraClass = '',
  } = props;

  const ImageComponent = image && (
    <Image
      id={`img_${containerId}`}
      className={classNames(
        styles.fillLayer,
        styles.imageFillLayer,
        IMAGE_CLASS_FOR_LAYOUT,
      )}
      {...image}
    />
  );
  const BackgroundImageComponent = backgroundImage && (
    <BackgroundImage
      {...backgroundImage}
      className={classNames(
        styles.fillLayer,
        styles.imageFillLayer,
        IMAGE_CLASS_FOR_LAYOUT,
      )}
    />
  );
  const VideoComponent = video && (
    <Video
      id={`videoContainer_${containerId}`}
      {...video}
      videoRef={videoRef}
    />
  );

  const Media = (
    <React.Fragment>
      {ImageComponent}
      {BackgroundImageComponent}
      {VideoComponent}
    </React.Fragment>
  );

  const BgMedia = backgroundMedia ? (
    <BackgroundMedia id={`bgMedia_${containerId}`} {...backgroundMedia}>
      {Media}
    </BackgroundMedia>
  ) : (
    <div id={`bgMedia_${containerId}`} className={styles.bgMedia}>
      {Media}
    </div>
  );
  const BgOverlay = backgroundOverlay && (
    <BackgroundOverlay {...backgroundOverlay} />
  );

  return (
    <div
      id={`bgLayers_${containerId}`}
      className={classNames(styles.layersContainer, extraClass, {
        [styles.fullScreenScrollEffect]: hasBgFullscreenScrollEffect,
      })}
    >
      {!video && (
        <div
          data-testid={TestIds.colorUnderlay}
          className={classNames(styles.bgUnderlay, styles.fillLayer)}
        />
      )}
      {shouldPadMedia ? (
        <div
          data-testid={TestIds.mediaPadding}
          className={styles.mediaPaddingLayer}
        >
          {BgMedia}
          {BgOverlay}
        </div>
      ) : (
        <React.Fragment>
          {BgMedia}
          {BgOverlay}
        </React.Fragment>
      )}
    </div>
  );
};

export default FillLayers;
