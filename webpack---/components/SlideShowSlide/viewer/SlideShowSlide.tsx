import React, { FunctionComponent } from 'react';
import { SlideShowSlideProps } from '../SlideShowSlide.types';
import MeshContainer from '../../../thunderbolt-core-components/MeshContainer/viewer/MeshContainer';
import FillLayers from '../../FillLayers/viewer/FillLayers';
import styles from './style/SlideShowSlide.scss';

const SlideShowSlide: FunctionComponent<SlideShowSlideProps> = ({
  id,
  fillLayers,
  children,
  meshProps,
  onMouseEnter,
  onMouseLeave,
}) => {
  return (
    <div
      id={id}
      className={styles.SlideShowSlide}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <FillLayers {...fillLayers} extraClass={styles.bg} />
      <div className={styles.borderNode} />
      <MeshContainer id={id} {...meshProps}>
        {children}
      </MeshContainer>
    </div>
  );
};

export default SlideShowSlide;
