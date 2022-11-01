/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

import React, { Component } from 'react';
import classNames from 'classnames/bind';
import PickBox from '../PickBox/PickBox';
import styles from './CheckBox.scss';
import * as T from '../Typography/Typopgraphy';

const cx = classNames.bind(styles);

export default class CheckBox extends Component {
  requestChange = () => {
    const { checked, onChange } = this.props;

    onChange && onChange({ checked: !checked });
  };

  render() {
    const { error, checked, label, className, tabIndex = 0, ...rest } = this.props;

    return (
      <div className={cx('CheckBox', className)} tabIndex={tabIndex} {...rest}>
        <PickBox label={label} onClick={this.requestChange} checked={checked} />
        {error && (
          <T.Caption className={cx('error')} error>
            {error}
          </T.Caption>
        )}
      </div>
    );
  }
}
