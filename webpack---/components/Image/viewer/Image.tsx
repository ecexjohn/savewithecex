import * as React from 'react';
import classNames from 'classnames';
import { ImageProps } from '../Image.types';
import styles from './style/Image.scss';

const Image: React.FC<ImageProps> = props => {
  const {
    id,
    containerId,
    uri,
    alt,
    name,
    width,
    height,
    displayMode,
    devicePixelRatio,
    quality,
    alignType,
    hasBgScrollEffect,
    bgEffectName = '',
    focalPoint,
    className = '',
    filterEffectSvgString,
    maskDataElementString,
    crop,
    isZoomed,
    imageStyles = {},
    onLoad = () => {},
    onError = () => {},
  } = props;

  const imageInfo = {
    containerId,
    ...(alignType && { alignType }),
    displayMode,
    imageData: {
      width,
      height,
      uri,
      name,
      displayMode,
      ...(quality && { quality }),
      ...(devicePixelRatio && { devicePixelRatio }),
      ...(focalPoint && { focalPoint }),
      ...(crop && { crop }),
    },
  };

  const filterEffectSvg = filterEffectSvgString ? (
    <svg id={`svg_${id}`} className={styles.filterEffectSvg}>
      <defs dangerouslySetInnerHTML={{ __html: filterEffectSvgString }} />
    </svg>
  ) : null;

  return (
    <wix-image
      id={id}
      class={classNames(styles.image, className)}
      data-image-info={JSON.stringify(imageInfo)}
      data-has-bg-scroll-effect={hasBgScrollEffect}
      data-bg-effect-name={bgEffectName}
      data-is-svg={!!maskDataElementString}
      data-is-svg-mask={!!maskDataElementString}
      data-image-zoomed={isZoomed || ''}
      key={id + isZoomed}
    >
      {filterEffectSvg}
      {maskDataElementString ? (
        <div
          className={styles.shapeCrop}
          dangerouslySetInnerHTML={{ __html: maskDataElementString }}
        />
      ) : (
        <img alt={alt} style={imageStyles} onLoad={onLoad} onError={onError} />
      )}
    </wix-image>
  );
};

export default Image;
