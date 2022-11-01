/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

import React, { Component } from 'react';
import { observer } from 'mobx-react';
import classnames from 'classnames/bind';

import { trans } from '../../common/trans';
import * as T from '../../components/Typography/Typopgraphy';
import * as C from '../../components/Card/Card';
import CalendarApproval from '../resources/calendarApproval.svg';
import styles from './ThankYouCard.scss';

const cx = classnames.bind(styles);

@observer
export default class ThankYouCard extends Component {
  render() {
    const {
      thankYouSubTitle1 = trans('THANK_YOU_SUB_1', 'Thank you for booking a tour!'),
      thankYouSubTitle2 = trans('THANK_YOU_SUB_2', 'You will get your confirmation details via email.'),
      thankYouImage,
      container,
    } = this.props;

    return (
      <C.Card>
        <C.Content container={container}>
          <div className={cx('container')}>
            {thankYouImage || <CalendarApproval className={cx('calendar')} />}
            <T.Header className={cx('title')}>{thankYouSubTitle1}</T.Header>
            <T.Text secondary className={cx('subTitle')}>
              {thankYouSubTitle2}
            </T.Text>
          </div>
        </C.Content>
      </C.Card>
    );
  }
}
