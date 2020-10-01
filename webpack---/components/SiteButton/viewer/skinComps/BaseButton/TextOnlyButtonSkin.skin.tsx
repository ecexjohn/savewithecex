import * as React from 'react';
import SiteButton from '../../SiteButton';
import { SkinButtonProps } from '../SkinButton';
import { ISiteButtonProps } from '../../../SiteButton.types';
import BaseButtonSkin from './BaseButton';
import skinsStyle from './styles/TextOnlyButtonSkin.scss';

const TextOnlyButtonSkinSkin: React.FC<SkinButtonProps> = props => (
  <BaseButtonSkin {...props} skinsStyle={skinsStyle}></BaseButtonSkin>
);

const TextOnlyButtonSkin: React.FC<Omit<ISiteButtonProps, 'skin'>> = props => (
  <SiteButton {...props} skin={TextOnlyButtonSkinSkin} />
);

export default TextOnlyButtonSkin;
