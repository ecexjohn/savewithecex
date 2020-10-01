import * as React from 'react';
import Link from '../../Link/viewer/Link';
import Image from '../../Image/viewer/Image';
import { LinkBarProps } from '../LinkBar.types';
import styles from './style/LinkBar.scss';
import * as translations from './constants';

const LinkBar: React.FC<LinkBarProps> = props => {
  const { id, translate, images } = props;

  const getImageProps = ({
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    link,
    ...imageProps
  }: LinkBarProps['images'][number]) => imageProps;

  const translatedAriaLabel = translate!(
    translations.ARIA_LABEL_NAMESPACE,
    translations.ARIA_LABEL_KEY,
    translations.ARIA_LABEL_DEFAULT,
  );

  return (
    <div id={id} className={styles.root}>
      <ul className={styles.container} aria-label={translatedAriaLabel}>
        {images.map((imageProps, index) => (
          <li
            id={imageProps.containerId}
            key={imageProps.containerId}
            className={styles.listItem}
          >
            <Link className={styles.link} {...imageProps.link}>
              <Image
                id={`${id}_img_${index}`}
                {...getImageProps(imageProps)}
                className={styles.image}
              />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LinkBar;
