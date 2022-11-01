/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

import classnames from 'classnames/bind';
import { action, observable } from 'mobx';
import { observer } from 'mobx-react';
import React, { Component } from 'react';
import TextBox from '../../../components/TextBox/TextBox';
import styles from './ChatGardenWidget.scss';
import Button from '../../../components/Button/Button';
import { formatPhoneToDisplay, isValidPhoneNumber } from '../../../common/phone/phone-helper';
import { isValidEmail } from '../../../common/email/emailHelper';
import { ErrorSummary } from '../../../components/ErrorBlock/ErrorBlock';
import { trans } from '../../../common/trans';

const cx = classnames.bind(styles);

// To be replaced from Corticon
const SUBMIT_STRING = 'Continue';
const NOT_RIGHT_NOW_STRING = 'Not right now';
const SEND_COMMENT_STRING = 'Send Comment';
const SEND_STRING = 'Send';

@observer
export default class ChatInputBox extends Component {
  @action
  setInputMessageType(type) {
    let translatedString = '';
    switch (type) {
      case 'email':
        translatedString = trans('INVALID_EMAIL', 'Enter a valid email');
        break;
      case 'phone':
        translatedString = trans('INVALID_PHONE', 'Enter a valid phone number');
        break;
      default:
        translatedString = 'Unknown';
    }
    this.setInputMessages(translatedString);
  }

  @action
  handleChange = input => {
    const { chat } = this.props;
    this.inputValue = input.value;
    this.setInputMessageType(chat.storeValue || chat.storeField);
    if (chat.storeValue === 'phone' || chat.storeField === 'phone') {
      this.inputValue = formatPhoneToDisplay(input.value);
    }
    if (this.hasInputError && (chat.storeValue === 'phone' || chat.storeField === 'phone')) {
      this.hasInputError = !isValidPhoneNumber(this.inputValue);
    }
    if (this.hasInputError && (chat.storeValue === 'email' || chat.storeField === 'email')) {
      this.hasInputError = !isValidEmail(input.value);
    }
  };

  @action
  validateInputFields = () => {
    const { chat } = this.props;
    this.setInputMessageType(chat.storeValue || chat.storeField);
    if (chat.storeValue === 'phone' || chat.storeField === 'phone') {
      this.hasInputError = !isValidPhoneNumber(this.inputValue);
    } else if (chat.storeValue === 'email' || chat.storeField === 'email') {
      this.hasInputError = !isValidEmail(this.inputValue);
    } else {
      this.hasInputError = false;
    }
  };

  @action onEnterKeyPress = event => {
    const isSingleLine = this.props.chat.inputProperties.singleLine;
    event.key === 'Enter' && this.inputValue && this.hasInputError === false && isSingleLine && this.submitToParent(this.inputValue !== '');
  };

  @action onInputBlur = () => {
    this.validateInputFields();
  };

  @action handleValidateInput = () => this.inputValue && (this.inputValue && this.inputValue.trim().length > 0);

  @observable inputValue = null;

  @observable hasInputError = false;

  @observable
  inputMessage = {
    title: trans('ERROR_SUMMARY_TITLE', 'Some of the required fields are missing'),
    summary: [],
  };

  @action
  setInputMessages = message => (this.inputMessage.summary = [message]);

  submitToParent = (shouldSubmit, apiCall) => {
    this.validateInputFields();
    if (this.hasInputError) return;
    if (!shouldSubmit) {
      // Submitting with no response value will allow bot to disregard non required form fields
      this.props.handleSubmit();
      return;
    }
    if (this.hasInputError) return;
    this.props.handleSubmit(this.inputValue, apiCall && apiCall);
  };

  isTextBoxDisabled(inputProperties) {
    if (!inputProperties) return false;
    if (!inputProperties.isRequired) return this.inputValue ? this.inputValue?.length < 5 : true;
    return inputProperties.isRequired === true && !this.inputValue;
  }

  // TODO: The issue here is assuming notRequired = Comments storeField. To FIX on V1
  returnNonRequiredCopy() {
    const sendString = this.props.chat?.storeField === 'chatMessage' ? SEND_COMMENT_STRING : SEND_STRING;
    return this.handleValidateInput() ? sendString : NOT_RIGHT_NOW_STRING;
  }

  render() {
    const { chat } = this.props;
    const inputProperties = chat.inputProperties;
    const placeholder = inputProperties && inputProperties.helperText ? inputProperties.helperText : '';
    const isTextDisabled = this.isTextBoxDisabled(inputProperties);

    return [
      <TextBox
        autoFocus={true}
        key="input"
        error={this.hasInputError}
        className={cx('input', 'input_button', { hasError: this.hasInputError })}
        value={this.inputValue}
        placeholder={placeholder}
        onChange={this.handleChange}
        multiline={!chat.inputProperties.singleLine}
        onKeyPressHandler={this.onEnterKeyPress}
        onBlur={this.onInputBlur}
        onInput={ev => {
          // TODO consider moving this out to a helper fn
          ev.currentTarget.style.height = '';
          if (!chat.inputProperties.singleLine && ev.currentTarget) {
            ev.currentTarget.style.height = `${ev.currentTarget?.scrollHeight}px`;
          }
        }}
      />,
      this.hasInputError && <ErrorSummary key="error-summary" title={this.inputMessage.title} summary={this.inputMessage.summary} style={{ margin: 8 }} />,
      <Button
        key="sendBtn"
        className={cx('fullWidthButton')}
        type={isTextDisabled ? 'outline' : 'raised'}
        disabled={(inputProperties.isRequired && isTextDisabled) || this.hasInputError}
        btnRole="primary"
        wide
        label={inputProperties.isRequired ? SUBMIT_STRING : this.returnNonRequiredCopy()}
        onClick={() => this.submitToParent(this.inputValue !== '', chat.submitAPICall ? chat.submitAPICall[0] : null)}
      />,
    ];
  }
}
