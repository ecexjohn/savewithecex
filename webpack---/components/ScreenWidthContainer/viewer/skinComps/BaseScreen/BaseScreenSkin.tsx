import * as React from 'react';
import classNames from 'classnames';
import { SkinScreenWidthContainerProps } from '../../../SkinScreenWidthContainer';

export type BaseScreenSkinProps = SkinScreenWidthContainerProps & {
  skinsStyle: Record<string, string>;
};

const BaseScreen: React.FC<BaseScreenSkinProps> = ({
  wrapperProps: { id, tagName = 'div', eventHandlers },
  children,
  skinsStyle,
  animation,
}) => {
  const SemanticElement = tagName as keyof JSX.IntrinsicElements;

  return (
    <SemanticElement
      id={id}
      className={classNames(
        skinsStyle.root,
        animation && skinsStyle[animation],
      )}
      {...eventHandlers}
    >
      <div className={skinsStyle.screenWidthBackground}></div>
      <div className={skinsStyle.centeredContent}>
        <div className={skinsStyle.centeredContentBg}></div>
        <div className={skinsStyle.inlineContent}>{children}</div>
      </div>
    </SemanticElement>
  );
};

export default BaseScreen;
