import * as React from 'react';
import classnames from 'classnames';
import { ISiteMembersInputProps } from '../SiteMembersInput.types';
import TextInput from '../../TextInput/viewer/TextInput';
import style from './style/style.scss';
import { testIds } from './constants';

type IRefActions = {
  validate: (
    translate: (key: string, defaultValue: string) => string,
  ) => boolean;
  setError: (errorMsg: string) => void;
};

export type ISiteMembersInputRef = HTMLInputElement & IRefActions;

const SiteMembersInput: React.ForwardRefRenderFunction<
  IRefActions,
  ISiteMembersInputProps
> = (props, ref) => {
  const {
    id,
    value,
    onValueChanged,
    label,
    placeholder,
    isValid,
    errorMessage,
    inputType,
    autoFocus,
    validationFn,
  } = props;
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [
    shouldShowValidityIndication,
    setShouldShowValidityIndication,
  ] = React.useState(!isValid);
  const [inlineErrorMsg, setInlineErrorMsg] = React.useState<
    string | undefined
  >(errorMessage);
  const errorMessageId = `siteMembersInputErrorMessage_${id}`;

  React.useImperativeHandle(ref, () => {
    return {
      validate: (translate: (key: string, defaultValue: string) => string) => {
        const errorMsg = validationFn?.(value, translate);

        if (!errorMsg) {
          return true;
        }
        setShouldShowValidityIndication(true);
        setInlineErrorMsg(errorMsg);
        inputRef.current!.setCustomValidity(errorMsg);
        inputRef.current!.focus();
        return false;
      },
      setError: (errorMsg: string) => {
        setShouldShowValidityIndication(true);
        setInlineErrorMsg(errorMsg);
        inputRef.current!.setCustomValidity(errorMsg);
      },
    };
  });

  return (
    <div
      id={id}
      className={classnames(style.emailInput, {
        [style.invalid]: shouldShowValidityIndication,
      })}
      data-testid={testIds.container}
    >
      <TextInput
        ref={inputRef}
        id={`input_${id}`}
        inputType={inputType}
        skin="AppsTextInputSkin"
        data-testid={testIds.input}
        value={value}
        label={label}
        placeholder={placeholder}
        required
        autoComplete={false}
        autoComplete_="off"
        readOnly={false}
        isDisabled={false}
        autoFocus={autoFocus}
        shouldShowValidityIndication={shouldShowValidityIndication}
        hideValidityIndication={() => {
          setShouldShowValidityIndication(false);
          setInlineErrorMsg(undefined);
        }}
        onValueChange={onValueChanged}
        aria-describedby={!inlineErrorMsg ? undefined : errorMessageId}
      />
      {inlineErrorMsg && (
        <span id={errorMessageId} data-testid={testIds.inlineErrorMsg}>
          {inlineErrorMsg}
        </span>
      )}
    </div>
  );
};

export default React.forwardRef(SiteMembersInput);
