/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

import React, { Component } from 'react';
import TextBox from '../TextBox/TextBox';

export default class DatePicker extends Component {
  handleFocus = e => {
    e.target.type = 'date';
    const { onFocus } = this.props;
    onFocus && onFocus(e);
  };

  handleBlur = e => {
    if (!e.target.value) {
      e.target.type = 'text';
    }
    const { onBlur } = this.props;
    onBlur && onBlur(e);
  };

  render() {
    const { props } = this;
    const { onFocus, onBlur, value, ...restProps } = props;
    const theType = !value ? 'text' : 'date';
    return <TextBox value={value} {...restProps} type={theType} onFocus={this.handleFocus} onBlur={this.handleBlur} />;
  }
}
