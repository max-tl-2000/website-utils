/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

import { observable, action } from 'mobx';
import { observer } from 'mobx-react';

import React, { Component } from 'react';
import debounce from 'debouncy';
import classnames from 'classnames/bind';

import * as T from '../Typography/Typopgraphy';
import styles from './TextBox.scss';
import { contains } from '../../common/dom';

const cx = classnames.bind(styles);

@observer
export default class TextBox extends Component {
  @observable
  value = '';

  @observable
  focused = false;

  clearComponentName = 'textbox-clear';

  constructor(props) {
    super(props);
    this.setValue(props.value || '');
  }

  static defaultProps = {
    border: true,
  };

  componentDidMount() {
    this.props.autoFocus && this.focusInput();
  }

  @action
  handleFocus = (e, fire = true) => {
    this.focused = true;
    const { onFocus } = this.props;
    fire && onFocus && onFocus(e);

    this.handleBlur.cancel();
  };

  handleBlur = debounce(
    action(e => {
      const containsCurrentActiveElement = contains(this.wrapperRef, document.activeElement);

      if (containsCurrentActiveElement) return;
      this.focused = false;
      this._raiseBlur(e);
    }),
    50,
  );

  handleChange = e => {
    this.setValue(e.target.value);
    this._raiseChange();
  };

  @action
  _raiseChangeImmediate = () => {
    const { value, props } = this;
    const { onChange } = props;

    onChange && onChange({ value });
  };

  _raiseChange = debounce(this._raiseChangeImmediate, 50);

  @action
  _raiseBlur = e => {
    this._raiseChangeImmediate();
    const { onBlur } = this.props;
    onBlur && onBlur(e);
  };

  @action
  setValue = value => {
    this.value = value;
  };

  clearTextIfEnter = e => {
    if (e.key !== 'Enter') {
      return;
    }
    this.clearText();
  };

  clearText = () => {
    const { clearTextRequest } = this.props;
    if (clearTextRequest) {
      clearTextRequest();
      return;
    }

    this.setValue('');
    this._raiseChange();
  };

  componentDidUpdate(prevProps) {
    const { props: nextProps } = this;

    if (prevProps.value !== nextProps.value) {
      if (this.value !== nextProps.value) {
        this.setValue(nextProps.value);
      }
    }
  }

  storeWrapper = ref => {
    this.wrapperRef = ref;
  };

  storeInputRef = ref => {
    this.inputRef = ref;
  };

  focusInput = () => {
    if (!this.inputRef) return;
    this.inputRef.focus();
  };

  get DOMNode() {
    return this.inputRef;
  }

  render() {
    const {
      type = 'text',
      placeholder,
      id,
      error,
      className,
      wide,
      onBlur,
      onChange,
      wrapperStyle,
      wrapperClassName,
      value: _value,
      multiline,
      iconAffordance,
      showClear,
      textAlign,
      small,
      disabled,
      clearTextRequest,
      border,
      iconOnLeft,
      fixedIconAffordance,
      forceClearVisible,
      inputClassName,
      wrapperId,
      alignRightErrorMsg,
      lighterPlaceholder,
      onKeyPressHandler,
      ...rest
    } = this.props;
    const { value, handleChange, focused, clearComponentName } = this;

    const shouldConsiderFixedIconAffordance = fixedIconAffordance || !showClear;

    const affordanceIconComponent =
      iconAffordance && (shouldConsiderFixedIconAffordance || !value || (!!value && !focused)) ? (
        <div className={cx('affordance-holder')}>{iconAffordance}</div>
      ) : (
        ''
      );
    const accessoryComponent = showClear ? (
      <div
        tabIndex={0}
        onFocus={e => this.handleFocus(e, false)}
        onBlur={this.handleBlur}
        data-component={clearComponentName}
        className={cx('clear-box', { on: (!!value && focused) || forceClearVisible })}
        onKeyDown={this.clearTextIfEnter}
        onClick={this.clearText}>
        <svg viewBox="0 0 24 24">
          <path d="M17.6,19L12,13.4L6.4,19L5,17.6l5.6-5.6L5,6.4L6.4,5l5.6,5.6L17.6,5L19,6.4L13.4,12l5.6,5.6L17.6,19z" />
        </svg>
      </div>
    ) : (
      ''
    );

    const outerClasses = cx(
      'TextBox',
      {
        wide,
        disabled,
        showIconAffordance: iconAffordance,
        clearable: showClear,
        small,
        iconOnLeft,
        lighterPlaceholder,
      },
      className,
    );

    return (
      <div ref={this.storeWrapper} className={outerClasses} data-component="textbox" onClick={this.focusInput} style={wrapperStyle} data-id={wrapperId}>
        <div className={cx('Wrapper', wrapperClassName, { focused, multiline, noBorder: !border, error })}>
          {iconOnLeft && affordanceIconComponent}
          {multiline ? (
            <textarea
              {...rest}
              className={inputClassName}
              ref={this.storeInputRef}
              id={id}
              value={value}
              type={type}
              onFocus={this.handleFocus}
              onBlur={this.handleBlur}
              placeholder={placeholder}
              onChange={handleChange}
              disabled={disabled}
              data-part="input"
              onKeyPress={onKeyPressHandler}
            />
          ) : (
            <input
              {...rest}
              ref={this.storeInputRef}
              id={id}
              value={value}
              type={type}
              onFocus={this.handleFocus}
              onBlur={this.handleBlur}
              placeholder={placeholder}
              onChange={handleChange}
              className={cx(inputClassName, textAlign, { disabled })}
              disabled={disabled}
              data-part="input"
              onKeyPress={onKeyPressHandler}
            />
          )}
          {!iconOnLeft && affordanceIconComponent}
          {accessoryComponent}
        </div>
        {error && (
          <T.Caption className={cx('error', { alignRightErrorMsg })} error>
            {error}
          </T.Caption>
        )}
      </div>
    );
  }
}
