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

import styles from './ConfirmAppointmentDate.scss';
import Button from '../../components/Button/Button';
import LoadingBlock from '../../components/LoadingBar/LoadingBlock';

const cx = classnames.bind(styles);

@observer
export default class ConfirmAppointmentDate extends Component {
  render() {
    const { appointmentEditModel: aem } = this.props;

    const newAppointmentDate = trans('NEW_APPOINTMENT_WILL_BE_ON', 'New appointment is scheduled for {{newAppointmentDate}}', {
      newAppointmentDate: aem.newAppointmentTimeFormatted,
    });

    const previousAppointmentTimeWasOn = trans('PREVIOUS_APPOINTMENT_WAS_ON', '(Previously it was on {{previousAppointmentTime}})', {
      previousAppointmentTime: aem.appoinmentStartFormatted,
    });

    const { appointmentUpdateLoading, appointmentUpdateError } = aem;

    const confirmActionLabel = appointmentUpdateLoading
      ? trans('UPDATING_APPOINTMENT', 'Updating appointment...')
      : trans('CONFIRM_APPOINTMENT_UPDATE', 'Update appointment');

    const goBackLabel = trans('SELECT_A_DIFFERENT_TIME', 'Select a different time');

    return (
      <C.Card>
        <C.Content>
          <div className={cx('container')}>
            <CalendarApproval className={cx('calendar')} />
            <T.Header className={cx('title')}>{newAppointmentDate}</T.Header>
            <T.Text secondary className={cx('subTitle')}>
              {previousAppointmentTimeWasOn}
            </T.Text>
            {appointmentUpdateError && <T.Text error>{appointmentUpdateError}</T.Text>}
            <div className={cx('actions')}>
              <Button btnRole="secondary" disabled={appointmentUpdateLoading} label={goBackLabel} onClick={aem.restartWizard} />
              <Button disabled={appointmentUpdateLoading} label={confirmActionLabel} onClick={aem.performAppointmentUpdate} />
            </div>
            {appointmentUpdateLoading && <LoadingBlock opaque />}
          </div>
        </C.Content>
      </C.Card>
    );
  }
}
