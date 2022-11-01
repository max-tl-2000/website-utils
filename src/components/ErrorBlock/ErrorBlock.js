/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

import React, { Component } from 'react';
import classnames from 'classnames/bind';
import styles from './ErrorBlock.scss';
import Revealer from '../Revealer/Revealer';
import * as T from '../Typography/Typopgraphy';

const cx = classnames.bind(styles);

export default class ErrorBlock extends Component {
  render() {
    const { message, className, fill, style, children } = this.props;
    const show = !!message;
    return (
      <Revealer style={style} className={cx('ErrorBlock', { fill }, className)} show={show}>
        <T.Caption error lighterForeground>
          {message} {children}
        </T.Caption>
      </Revealer>
    );
  }
}

export const ErrorSummary = ({ title, summary, className, fill, style }) => (
  <Revealer style={style} className={cx('ErrorBlock', 'errorSummary', { fill, noBorder: true }, className)} show={summary?.length}>
    <T.Caption error>{title}</T.Caption>
    <ul>
      {summary.map((error, index) => (
        // eslint-disable-next-line react/no-array-index-key
        <li key={`error${index}`}>
          <T.Caption inline error>
            {error}
          </T.Caption>
        </li>
      ))}
    </ul>
  </Revealer>
);
