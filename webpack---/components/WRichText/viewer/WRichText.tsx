import classNames from 'classnames';
import * as React from 'react';

import { IWRichTextProps } from '../WRichText.types';
import { TestIds } from '../constants';
import skinsStyle from './style/WRichText.scss';

const WRichText: React.FC<IWRichTextProps> = props => {
  const { id, html, skin = 'WRichTextSkin' } = props;

  const skinsWithContainer: Array<IWRichTextProps['skin']> = [
    'WRichTextSkin',
    'WRichTextClickableSkin',
  ];
  const isInContainer = skinsWithContainer.includes(skin);

  const sdkEventHandlers = {
    onMouseEnter: props.onMouseEnter,
    onMouseLeave: props.onMouseLeave,
    onClick: props.onClick,
    onDoubleClick: props.onDblClick,
  };

  const rootStyles = classNames(skinsStyle[skin], {
    [skinsStyle.clickable]: props.onClick || props.onDblClick,
  });

  return isInContainer ? (
    <div
      id={id}
      className={rootStyles}
      data-testid={TestIds.richTextElement}
      {...sdkEventHandlers}
    >
      <div
        className={skinsStyle.richTextContainer}
        dangerouslySetInnerHTML={{ __html: html }}
        data-testid={TestIds.containerElement}
      />
    </div>
  ) : (
    <div
      id={id}
      className={rootStyles}
      dangerouslySetInnerHTML={{ __html: html }}
      data-testid={TestIds.richTextElement}
      {...sdkEventHandlers}
    />
  );
};

export default WRichText;
