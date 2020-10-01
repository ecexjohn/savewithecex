import * as React from 'react';
import {
  ITextInputProps,
  ITextInputImperativeActions,
} from '../../../TextInput.types';
import TextInputBase from '../../TextInputBase';

const ResponsiveTextInputSkin: React.ForwardRefRenderFunction<
  ITextInputImperativeActions,
  ITextInputProps
> = (props, ref) => (
  <TextInputBase useLabel={false} ref={ref} {...props}></TextInputBase>
);

export default React.forwardRef(ResponsiveTextInputSkin);
