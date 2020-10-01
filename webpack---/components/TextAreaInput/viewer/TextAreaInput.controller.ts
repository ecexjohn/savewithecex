import { IComponentController } from '@wix/editor-elements-types';
import { ITextAreaInputControllerActions } from '../TextAreaInput.types';

const mapActionsToProps: IComponentController = ({
  updateProps,
}): ITextAreaInputControllerActions => ({
  onInput: event => {
    updateProps({
      value: event.currentTarget.value,
    });
  },
});

export default mapActionsToProps;
