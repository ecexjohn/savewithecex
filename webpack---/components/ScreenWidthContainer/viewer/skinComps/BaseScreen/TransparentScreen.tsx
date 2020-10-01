import React from 'react';
import skinsStyles from './styles/TransparentScreen.scss';
import BaseScreenSkin, { BaseScreenSkinProps } from './BaseScreenSkin';

const TransparentScreen: React.FC<Omit<
  BaseScreenSkinProps,
  'skin' | 'skinsStyle'
>> = props => <BaseScreenSkin {...props} skinsStyle={skinsStyles} />;

export default TransparentScreen;
