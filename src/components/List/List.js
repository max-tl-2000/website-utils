/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

import React, { Component } from 'react';
import classnames from 'classnames/bind';
import styles from './List.scss';

const cx = classnames.bind(styles);

export default class List extends Component {
  storeRef = ref => {
    this.ref = ref;
  };

  get DOMNode() {
    return this.ref;
  }

  render() {
    const { className, children, ...props } = this.props;
    return (
      <div data-component="list" className={cx('list', className)} ref={this.storeRef} {...props}>
        {children}
      </div>
    );
  }
}
