import { IComponentController } from '@wix/editor-elements-types';
import { ITextInputControllerActions } from '../TextInput.types';

const mapActionsToProps: IComponentController = ({
  updateProps,
}): ITextInputControllerActions => ({
  onInput: event => {
    updateProps({
      value: event.currentTarget.value,
    });
  },
});

export default mapActionsToProps;
