import * as React from 'react';
import {
  ITextInputProps,
  ITextInputImperativeActions,
} from '../../../TextInput.types';
import TextInputBase from '../../TextInputBase';

const AppsTextInputSkin: React.ForwardRefRenderFunction<
  ITextInputImperativeActions,
  ITextInputProps
> = (props, ref) => (
  <TextInputBase useLabel={true} ref={ref} {...props}></TextInputBase>
);

export default React.forwardRef(AppsTextInputSkin);
