/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { trans } from '../../common/trans';
import ThankYouStepCard from '../ThankYouStepCard/ThankYouStepCard';

@observer
export default class EditAppointmentThankYouCard extends Component {
  render() {
    const { appointmentEditModel: aem } = this.props;

    const thankYouTitle = trans('YOUR_APPOINTMENT_IS_NOW_ON', 'Your appointment is now on {{newAppointmentDate}}', {
      newAppointmentDate: aem.newAppointmentTimeFormatted,
    });
    const thankYouSubtitle = trans('YOU_WILL_GET_CONFIRMATION', "You'll get a confirmation email shortly");

    return <ThankYouStepCard title={thankYouTitle} subTitle={thankYouSubtitle} onRescheduleRequest={aem.restartWizard} />;
  }
}
