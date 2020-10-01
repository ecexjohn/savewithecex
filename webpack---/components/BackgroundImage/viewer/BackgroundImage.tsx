import * as React from 'react';
import { BackgroundImageProps } from '../BackgroundImage.types';

const defaultIdPrefix = 'bgImg_';

const BackgroundImage: React.FC<BackgroundImageProps> = props => {
  const { className, customIdPrefix, ...backgroundImage } = props;

  const tileImagedInfoString = React.useMemo(
    () =>
      JSON.stringify({
        containerId: backgroundImage.containerId,
        alignType: backgroundImage.alignType,
        fittingType: backgroundImage.displayMode,
        imageData: {
          width: backgroundImage.width,
          height: backgroundImage.height,
          uri: backgroundImage.uri,
          name: backgroundImage.name,
          ...(backgroundImage.quality && { quality: backgroundImage.quality }),
          displayMode: backgroundImage.displayMode,
        },
      }),
    [backgroundImage],
  );
  return (
    // 	Custom element defined in: https://github.com/wix-private/santa-core/blob/master/wix-custom-elements/src/elements/wixBgImage/wixBgImage.js
    <wix-bg-image
      id={`${customIdPrefix || defaultIdPrefix}${backgroundImage.containerId}`}
      class={className}
      data-tiled-image-info={tileImagedInfoString}
      data-has-bg-scroll-effect={backgroundImage.hasBgScrollEffect || ''}
      data-bg-effect-name={backgroundImage.bgEffectName || ''}
    />
  );
};

export default BackgroundImage;
