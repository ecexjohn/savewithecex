import React from 'react';
import classNames from 'classnames';
import { SkinScreenWidthContainerProps } from '../../../SkinScreenWidthContainer';
import skinsStyle from './styles/skins.scss';

const DefaultScreen: React.FC<SkinScreenWidthContainerProps> = ({
  wrapperProps: { id, tagName = 'div', eventHandlers },
  children,
  animation,
}) => {
  const SemanticElement = tagName as keyof JSX.IntrinsicElements;

  return (
    <SemanticElement
      id={id}
      className={classNames(
        skinsStyle.DefaultScreen,
        animation && skinsStyle[animation],
      )}
      {...eventHandlers}
    >
      <div className={skinsStyle.screenWidthBackground}>
        <div className={skinsStyle.bg} />
      </div>
      <div className={skinsStyle.centeredContent}>
        <div className={skinsStyle.centeredContentBg}>
          <div className={skinsStyle.bgCenter} />
        </div>
        <div className={skinsStyle.inlineContent}>{children}</div>
      </div>
    </SemanticElement>
  );
};

export default DefaultScreen;
