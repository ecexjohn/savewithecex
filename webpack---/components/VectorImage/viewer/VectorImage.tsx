import * as React from 'react';
import classNamesFn from 'classnames';

import { VectorImageProps } from '../VectorImage.types';
import Link from '../../Link/viewer/Link';
import styles from './style/VectorImage.scss';

const VectorImage: React.FC<VectorImageProps> = ({
  id,
  svgContent,
  shouldScaleStroke,
  withShadow,
  link,
  className = '',
  containerClass = '',
  onClick,
  onDblClick,
  onMouseEnter,
  onMouseLeave,
}) => {
  const classes = classNamesFn(
    styles.svgRoot,
    {
      [styles.nonScalingStroke]: !shouldScaleStroke,
      [styles.overflowVisible]: withShadow,
    },
    className,
  );
  const svgContentElement = (
    <div
      data-testid={`svgRoot-${id}`}
      className={classes}
      dangerouslySetInnerHTML={{ __html: svgContent }}
    />
  );
  return (
    <div
      id={id}
      className={containerClass}
      onClick={onClick}
      onDoubleClick={onDblClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {link ? (
        <Link className={styles.link} {...link}>
          {svgContentElement}
        </Link>
      ) : (
        svgContentElement
      )}
    </div>
  );
};

export default VectorImage;
