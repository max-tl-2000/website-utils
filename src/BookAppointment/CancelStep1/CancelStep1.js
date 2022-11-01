/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

import React, { Component } from 'react';
import { observer } from 'mobx-react';
import classnames from 'classnames/bind';
import * as T from '../../components/Typography/Typopgraphy';

import styles from './CancelStep1.scss';
import { trans } from '../../common/trans';
import Button from '../../components/Button/Button';
import LoadingBlock from '../../components/LoadingBar/LoadingBlock';
import SimpleMessageCard from '../SimpleMessageCard/SimpleMessageCard';

const cx = classnames.bind(styles);

@observer
export default class CancelStep1 extends Component {
  render() {
    const { appointmentCancelModel: acm } = this.props;

    const { appointmentCancelLoading, appointmentCancelError, appoinmentStartFormatted, isAppointmentCanceled } = acm;

    const title = isAppointmentCanceled
      ? trans('APPOINTMENT_CANCELED_ALREADY', 'The appointment on {{appointmentTime}} is already canceled', {
          appointmentTime: appoinmentStartFormatted,
        })
      : trans('CANCEL_APPOINTMENT_TITLE', "We understand you can't make it on {{appointmentTime}}", {
          appointmentTime: appoinmentStartFormatted,
        });

    const confirmActionLabel = trans('CANCEL_APPOINTMENT', 'Cancel appointment');

    return (
      <SimpleMessageCard message={title}>
        {appointmentCancelError && <T.Text error>{appointmentCancelError}</T.Text>}
        <div className={cx('actions')}>
          {!isAppointmentCanceled && <Button disabled={appointmentCancelLoading} label={confirmActionLabel} onClick={acm.performAppointmentCancel} />}
        </div>
        {appointmentCancelLoading && <LoadingBlock opaque />}
      </SimpleMessageCard>
    );
  }
}
