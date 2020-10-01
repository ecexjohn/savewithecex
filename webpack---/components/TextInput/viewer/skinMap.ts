import React from 'react';
import { ITextInputProps } from '../TextInput.types';
import { AppsTextInputSkin, ResponsiveTextInputSkin } from './skinComps';

export const TextInputSkinMap: {
  [P in ITextInputProps['skin']]: React.FC<ITextInputProps>;
} = {
  AppsTextInputSkin,
  ResponsiveTextInputSkin,
};
