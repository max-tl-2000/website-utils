/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

import React, { Component } from 'react';
import classnames from 'classnames/bind';
import styles from './ActionBar.scss';

const cx = classnames.bind(styles);

export default class ActionBar extends Component {
  render() {
    const { children, className, buttonCount } = this.props;

    return (
      <div className={cx('Footer', { oneButton: buttonCount === 1 }, className)} data-id="unitDialogFooter">
        {children}
      </div>
    );
  }
}
