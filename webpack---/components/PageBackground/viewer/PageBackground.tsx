import * as React from 'react';
import FillLayers from '../../FillLayers/viewer/FillLayers';
import { PageBackgroundProps } from '../PageBackground.types';
import styles from './style/PageBackground.scss';

const PageBackground: React.FC<PageBackgroundProps> = props => {
  const { id, fillLayers } = props;
  return (
    <div id={id} className={styles.pageBackground}>
      <FillLayers {...fillLayers} />
    </div>
  );
};

export default PageBackground;
