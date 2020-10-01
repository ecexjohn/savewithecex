import * as React from 'react';
import classNames from 'classnames';
import {
  ITextAreaInputBaseProps,
  ITextAreaInputImperativeActions,
} from '../TextAreaInput.types';
import { HAS_CUSTOM_FOCUS_CLASSNAME } from '../../../core/commons/a11y';
import style from './style/TextAreaInput.scss';

const TextAreaInputBase: React.ForwardRefRenderFunction<
  ITextAreaInputImperativeActions,
  ITextAreaInputBaseProps
> = (props, ref) => {
  const {
    skin,
    id,
    value = '',
    label,
    placeholder,
    readOnly,
    required,
    isDisabled,
    maxLength,
    isResponsive,
    shouldShowValidityIndication,
    validateValueAndShowIndication = () => {},
    hideValidityIndication = () => {},
    onBlur = () => {},
    onFocus = () => {},
    onKeyPress = () => {},
    onInput = () => {},
    onChange = () => {},
    onClick = () => {},
    onDblClick = () => {},
    onMouseEnter = () => {},
    onMouseLeave = () => {},
  } = props;

  const [valueChanged, setValueChanged] = React.useState<boolean>();

  const inputRef = React.useRef<HTMLTextAreaElement>(null);

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
    };
  });

  const _onChange: React.ChangeEventHandler<HTMLTextAreaElement> = event => {
    setValueChanged(true);
    hideValidityIndication();
    event.type = 'input';
    onInput(event);
  };

  const _onBlur: React.FocusEventHandler<HTMLTextAreaElement> = event => {
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

  const useLabel = !isResponsive;
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
        <label htmlFor={`textarea_${id}`} className={style.label}>
          {label}
        </label>
      )}
      <textarea
        ref={inputRef}
        id={`textarea_${id}`}
        className={classNames(style.textarea, HAS_CUSTOM_FOCUS_CLASSNAME)}
        rows={isResponsive ? 1 : undefined}
        value={value}
        onFocus={onFocus}
        onKeyDown={onKeyPress}
        onChange={_onChange}
        onBlur={_onBlur}
        placeholder={placeholder}
        readOnly={readOnly}
        required={required}
        maxLength={maxLength === null ? undefined : maxLength}
        disabled={isDisabled}
      ></textarea>
    </div>
  );
};

export default React.forwardRef(TextAreaInputBase);
