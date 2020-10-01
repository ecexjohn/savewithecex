import { LinkProps } from '@wix/thunderbolt-components';
import ZoomedImage from '../viewer/ZoomedImage';
import Image from '../../Image/viewer/Image';

export const selectProperComponent = (selectedMode: string) =>
  selectedMode === 'zoomAndPanMode' ? ZoomedImage : Image;

export const getPropsForLink = ({
  onClickBehavior,
  className,
  link,
}: {
  onClickBehavior: string;
  className: string;
  link?: LinkProps;
}) => {
  const isPopUp = onClickBehavior === 'zoomMode';
  const isMagnification = onClickBehavior === 'zoomAndPanMode';
  const basicLinkProps = { className };

  return isPopUp || isMagnification
    ? basicLinkProps
    : { ...link, ...basicLinkProps };
};
