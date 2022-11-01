/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

/* eslint-disable react/prefer-stateless-function */
/* eslint-disable react/no-multi-comp */

import React, { Component, Children } from 'react';
import classnames from 'classnames/bind';
import styles from './Card.scss';

const cx = classnames.bind(styles);

export class Actions extends Component {
  render() {
    const { className, compact, noPaddingAtSides, direction = 'row', children, container, ...rest } = this.props;

    return (
      <div className={cx('Actions', { compact, noCompact: !compact, container, noPaddingAtSides }, direction, className)} {...rest}>
        {children}
      </div>
    );
  }
}

export class Content extends Component {
  render() {
    const { className, overflow, compact, container, noPaddingBottom, children, ...rest } = this.props;
    return (
      <div className={cx('Content', { compact, container, overflow, noPaddingBottom }, className)} {...rest}>
        {children}
      </div>
    );
  }
}

export class Card extends Component {
  render() {
    const { className, compact, children, ...rest } = this.props;
    const [actions] = Children.toArray(children).filter(child => child && child.type === Actions);

    return (
      <div className={cx('Card', { withActions: !!actions && !compact, noCompact: !compact }, className)} {...rest}>
        {children}
      </div>
    );
  }
}
