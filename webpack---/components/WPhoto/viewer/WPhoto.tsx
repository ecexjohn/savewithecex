import * as React from 'react';
import { IWPhotoProps } from '../WPhoto.types';

const WPhoto: React.FC<IWPhotoProps> = props => {
  const {
    skin: WPhotoClass,
    id,
    uri,
    alt,
    name,
    width,
    height,
    displayMode,
    focalPoint,
    filterEffectSvgString,
    maskDataElementString,
    quality,
    crop,
  } = props;

  const imageProps = {
    containerId: id,
    uri,
    alt,
    name,
    width,
    height,
    displayMode,
    focalPoint,
    filterEffectSvgString,
    maskDataElementString,
    quality,
    crop,
  };
  return <WPhotoClass {...props} imageProps={imageProps} />;
};

export default WPhoto;
