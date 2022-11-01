/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

import React, { Component } from 'react';
import { observer } from 'mobx-react';
import classnames from 'classnames/bind';
import CalendarApproval from '../resources/calendarApproval.svg';

import * as T from '../../components/Typography/Typopgraphy';
import * as C from '../../components/Card/Card';

import styles from './SimpleMessageCard.scss';

const cx = classnames.bind(styles);

@observer
export default class SimpleMessageCard extends Component {
  render() {
    const { message, children } = this.props;

    return (
      <C.Card>
        <C.Content>
          <div className={cx('container')}>
            <T.Header className={cx('title')}>{message}</T.Header>
            <CalendarApproval className={cx('calendar')} />
            {children}
          </div>
        </C.Content>
      </C.Card>
    );
  }
}
