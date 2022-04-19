import React, { memo, useCallback, useEffect, useRef, useState } from "react";
import Textarea from "react-expanding-textarea";
import { bool, func, number, string, object } from "prop-types";
import cn from "classnames";
import EditorTextArea from "@components/_shared/form/EditorTextArea";
import { Controller } from "react-hook-form";

import "./TextArea.scss";

const TextArea = ({
  id,
  name,
  onChange,
  placeholder,
  register,
  value: propValue,
  disabled,
  defaultValue,
  onFocus,
  onBlur,
  onKeyDown,
  isError,
  label,
  classNames,
  isFixedHeightLabel,
  rows,
  isEditText,
  control,
  trigger,
  isBorder,
  readOnly,
  withTopPlaceholder,
}) => {
  const textareaRef = useRef(null);
  const [isFocus, setIsFocus] = useState(false);

  const styles = cn("textarea-container", {
    " error": isError,
    [classNames]: !!classNames,
    "with-border": isBorder,
  });

  const textareaStyles = cn("textarea", {
    "textarea-border": isBorder,
  });

  const textareaContainerStyles = cn({
    "with-top-placeholder": withTopPlaceholder,
  });

  const handleChange = useCallback(
    (e) => {
      if (onChange) onChange(e);
    },
    [onChange]
  );

  const onFocusHandler = useCallback(() => {
    setIsFocus(true);

    if (!onFocus) return;

    onFocus();
  }, [onFocus]);

  const onBlurHandler = useCallback(
    (e) => {
      setIsFocus(false);

      if (!onBlur) return;

      onBlur(e.target.value.trim());
    },
    [onBlur]
  );

  const handleKeyDown = (e) => {
    if (!onKeyDown) return;

    e.stopPropagation();
    onKeyDown(e);

    if (e.key === "Enter" && !e.shiftKey)
      document.querySelector("textarea.textarea").style =
        "height: 28px; overflow-y: hidden;";
  };

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  const customPlaceholder =
    withTopPlaceholder && !isFocus
      ? placeholder
      : !withTopPlaceholder
      ? placeholder
      : "";

  return (
    <div className={styles}>
      {!withTopPlaceholder && label && (
        <label
          className={isFixedHeightLabel ? "fixed-height-label" : ""}
          htmlFor={id}
        >
          {label}
        </label>
      )}
      {isEditText ? (
        <Controller
          defaultValue=""
          name={name}
          control={control}
          render={({ onChange, value, onBlur }, { isDirty }) => {
            const onChangeHandler = (markdown) => {
              onChange(markdown);

              if (isDirty) trigger(name);
            };

            const onBlurHandler = (e) => onBlur(e);

            return (
              <EditorTextArea
                placeholder={placeholder}
                classNames={classNames}
                id={id}
                name={name}
                isError={isError}
                value={value}
                onChange={onChangeHandler}
                onBlur={onBlurHandler}
                register={register}
                trigger={trigger}
                readOnly={readOnly}
                isBorder={isBorder}
              />
            );
          }}
        />
      ) : (
        <div className={textareaContainerStyles} ref={textareaRef}>
          {withTopPlaceholder && (isFocus || propValue) && (
            <label>{placeholder}</label>
          )}
          <Textarea
            className={textareaStyles}
            defaultValue={defaultValue}
            id={id}
            name={name}
            onChange={handleChange}
            placeholder={customPlaceholder}
            ref={register}
            value={propValue}
            disabled={disabled}
            rows={rows}
            onFocus={onFocusHandler}
            onBlur={onBlurHandler}
            onKeyDown={handleKeyDown}
          />
        </div>
      )}
    </div>
  );
};

TextArea.defaultProps = {
  placeholder: "Type here...",
  value: undefined,
  name: "textarea",
  defaultValue: undefined,
  isError: false,
  isFixedHeightLabel: false,
  rows: 10,
  isEditText: false,
  isBorder: false,
  readOnly: false,
  withTopPlaceholder: false,
};

TextArea.propTypes = {
  id: string,
  name: string,
  onChange: func,
  onBlur: func,
  onFocus: func,
  placeholder: string,
  register: func,
  value: string,
  disabled: bool,
  defaultValue: string,
  isError: bool,
  label: string,
  classNames: string,
  isFixedHeightLabel: bool,
  rows: number,
  onKeyDown: func,
  isEditText: bool,
  control: object,
  trigger: func,
  isBorder: bool,
  readOnly: bool,
  withTopPlaceholder: bool,
};

export default memo(TextArea);
