/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

import React, { Component } from 'react';
import { action } from 'mobx';
import { observer, inject } from 'mobx-react';
import * as W from '../../components/Wizard/Wizard';
import { trans } from '../../common/trans';
import DateTimeSelector from '../DateTimeSelector/DateTimeSelector';
import LoadingBlock from '../../components/LoadingBar/LoadingBlock';
import ErrorBlock from '../../components/ErrorBlock/ErrorBlock';
import ConfirmAppointmentDate from '../ConfirmAppointmentDate/ConfirmAppointmentDate';
import EditAppointmentThankYouCard from '../EditAppointmentThankYouCard/EditAppointmentThankYouCard';
import SimpleMessageCard from '../SimpleMessageCard/SimpleMessageCard';

@inject('appointmentEditModel')
@observer
export default class AppointmentEdit extends Component {
  constructor(props) {
    super(props);
    props.appointmentEditModel.loadAppointment();
  }

  @action
  selectDateTime = dateTime => {
    const { appointmentEditModel: aem } = this.props;
    aem.updateDateTime(dateTime);
  };

  render() {
    const { appointmentEditModel: aem } = this.props;
    const { appoinmentStartFormatted } = aem;
    const step1Title = trans('CANCEL_TOUR_TITLE', "We understand you can't make on {{appointmentDateTime}}", {
      appointmentDateTime: appoinmentStartFormatted,
    });
    const step1SubTitle = trans('CANCEL_TOUR_SUB_TITLE', "Select a new date and time below that'll work better.");

    const step2Title = trans('CONFIRM_APPOINTMENT_TITLE', 'Confirm new appointment details');

    const canceledTitle = trans('APPOINTMENT_CANCELED_ALREADY', 'The appointment on {{appointmentTime}} is already canceled', {
      appointmentTime: appoinmentStartFormatted,
    });

    return (
      <div style={{ minHeight: 500, position: 'relative' }}>
        {aem.appointmentLoaded && (
          <W.Wizard index={aem.wizardIndex}>
            {aem.isAppointmentCanceled && <SimpleMessageCard message={canceledTitle} />}
            {!aem.isAppointmentCanceled && (
              <W.Step title={step1Title} subTitle={step1SubTitle} container={false}>
                <DateTimeSelector onSelect={this.selectDateTime} />
              </W.Step>
            )}
            <W.Step title={step2Title}>
              <ConfirmAppointmentDate appointmentEditModel={aem} />
            </W.Step>
            <W.Step>
              <EditAppointmentThankYouCard appointmentEditModel={aem} />
            </W.Step>
          </W.Wizard>
        )}
        {aem.appointmentLoading && <LoadingBlock />}
        {aem.appointmentLoadingError && <ErrorBlock fill message={aem.appointmentLoadingError} />}
      </div>
    );
  }
}
