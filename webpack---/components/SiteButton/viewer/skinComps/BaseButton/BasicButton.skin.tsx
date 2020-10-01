import * as React from 'react';
import SiteButton from '../../SiteButton';
import { SkinButtonProps } from '../SkinButton';
import { ISiteButtonProps } from '../../../SiteButton.types';
import BaseButtonSkin from './BaseButton';
import skinsStyle from './styles/BasicButton.scss';

const BasicButtonSkin: React.FC<SkinButtonProps> = props => (
  <BaseButtonSkin {...props} skinsStyle={skinsStyle}></BaseButtonSkin>
);

const BasicButton: React.FC<Omit<ISiteButtonProps, 'skin'>> = props => (
  <SiteButton {...props} skin={BasicButtonSkin} />
);

export default BasicButton;
