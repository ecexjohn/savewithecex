import * as React from 'react';
import {
  ITextInputProps,
  ITextInputImperativeActions,
} from '../TextInput.types';
import { TextInputSkinMap } from './skinMap';

const TextInput: React.ForwardRefRenderFunction<
  ITextInputImperativeActions,
  ITextInputProps
> = (props, ref) => {
  const { skin } = props;

  const SkinComponent = TextInputSkinMap[skin];

  return <SkinComponent ref={ref} {...props}></SkinComponent>;
};

export default React.forwardRef(TextInput);
