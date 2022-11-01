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
import styles from './ThankYouStepCard.scss';

const cx = classnames.bind(styles);

@observer
export default class ThankYouStepCard extends Component {
  render() {
    const { title, subTitle, onRescheduleRequest, showFooterLine = true, children } = this.props;

    const mistakeMessage = trans('SOMETHING_CHANGED_OR_MADE_MISTAKE', 'Something changed or make a mistake? No Problem. You can always');
    const rescheduleLabel = trans('RESCHEDULE_AGAIN', 'reschedule again');

    return (
      <C.Card>
        <C.Content>
          <div className={cx('container')}>
            <CalendarApproval className={cx('calendar')} />
            <T.Header className={cx('title')}>{title}</T.Header>
            <T.Text secondary className={cx('subTitle')}>
              {subTitle}
            </T.Text>
            {children}
            {showFooterLine && (
              <T.Text className={cx('mistakeMessage', { hasChildren: !!children })}>
                {mistakeMessage}{' '}
                <T.Link inline onClick={onRescheduleRequest}>
                  {rescheduleLabel}
                </T.Link>
              </T.Text>
            )}
          </div>
        </C.Content>
      </C.Card>
    );
  }
}
