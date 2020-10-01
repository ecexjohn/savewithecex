import * as React from 'react';
import classNames from 'classnames';
import {
  ITextInputBaseProps,
  ITextInputImperativeActions,
} from '../TextInput.types';
import { HAS_CUSTOM_FOCUS_CLASSNAME } from '../../../core/commons/a11y';
import style from './style/TextInput.scss';

const TextInputBase: React.ForwardRefRenderFunction<
  ITextInputImperativeActions,
  ITextInputBaseProps
> = (props, ref) => {
  const {
    skin,
    id,
    value,
    inputType = 'text',
    label,
    placeholder,
    readOnly,
    required,
    isDisabled,
    pattern,
    autoComplete,
    autoComplete_,
    maxLength,
    min,
    max,
    step,
    useLabel,
    shouldShowValidityIndication,
    autoFocus,
    'aria-describedby': ariaDescribedby,
    validateValueAndShowIndication = () => {},
    hideValidityIndication = () => {},
    onBlur = () => {},
    onFocus = () => {},
    onKeyPress = () => {},
    onInput = () => {},
    onValueChange = () => {},
    onChange = () => {},
    onClick = () => {},
    onDblClick = () => {},
    onMouseEnter = () => {},
    onMouseLeave = () => {},
  } = props;

  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useImperativeHandle(ref, () => {
    return {
      focus: () => {
        inputRef.current?.focus();
      },
      blur: () => {
        inputRef.current?.blur();
      },
      setCustomValidity: (message: string) => {
        inputRef.current?.setCustomValidity(message);
      },
      getValidationMessage: () => {
        return inputRef.current?.validationMessage;
      },
    };
  });

  const [valueChanged, setValueChanged] = React.useState<boolean>();

  const _onChange: React.ChangeEventHandler<HTMLInputElement> = event => {
    setValueChanged(true);
    hideValidityIndication();
    onValueChange(event.target.value);
  };

  const _onBlur: React.FocusEventHandler<HTMLInputElement> = event => {
    onBlur(event);
    if (valueChanged) {
      onChange({
        ...event,
        type: 'change',
      });
    }
    setValueChanged(false);
    // TODO: Remove value override once PLAT-934 is fixed
    validateValueAndShowIndication({
      value: event.target.value,
    });
  };

  const _onClick: React.MouseEventHandler<HTMLDivElement> = event => {
    if (!isDisabled) {
      onClick(event);
    }
  };

  const _onDblClick: React.MouseEventHandler<HTMLDivElement> = event => {
    if (!isDisabled) {
      onDblClick(event);
    }
  };

  const _onMouseEnter: React.MouseEventHandler<HTMLDivElement> = event => {
    if (!isDisabled) {
      onMouseEnter(event);
    }
  };

  const _onMouseLeave: React.MouseEventHandler<HTMLDivElement> = event => {
    if (!isDisabled) {
      onMouseLeave(event);
    }
  };

  const hasLabel = useLabel && !!label;

  const containerClasses = classNames(style[skin], {
    [style.hasLabel]: hasLabel,
    [style.requiredIndication]: required,
    [style.validationIndication]: !!shouldShowValidityIndication,
  });

  return (
    <div
      id={id}
      className={containerClasses}
      onClick={_onClick}
      onDoubleClick={_onDblClick}
      onMouseEnter={_onMouseEnter}
      onMouseLeave={_onMouseLeave}
    >
      {useLabel && (
        <label htmlFor={`input_${id}`} className={style.label}>
          {label}
        </label>
      )}
      <div className={style.inputWrapper}>
        <input
          ref={inputRef}
          id={`input_${id}`}
          className={classNames(style.input, HAS_CUSTOM_FOCUS_CLASSNAME)}
          type={inputType}
          value={value}
          onFocus={onFocus}
          onKeyDown={onKeyPress}
          onInput={onInput}
          onChange={_onChange}
          onBlur={_onBlur}
          placeholder={placeholder}
          readOnly={readOnly}
          required={required}
          pattern={pattern}
          maxLength={maxLength === null ? undefined : maxLength}
          disabled={isDisabled}
          autoComplete={
            autoComplete ? 'on' : autoComplete_ ? autoComplete_ : undefined
          }
          step={step === null ? undefined : step}
          min={min === null ? undefined : min}
          max={max === null ? undefined : max}
          autoFocus={autoFocus}
          aria-describedby={ariaDescribedby}
        />
      </div>
    </div>
  );
};

export default React.forwardRef(TextInputBase);
