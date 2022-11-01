/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

import { observable, action, computed } from 'mobx';

import { trans } from '../common/trans';
import AppointmentDetailsModel from './AppointmentDetailsModel';

const WIZARD_DATETIME_SELECTOR_INDEX = 0;
const WIZARD_THANK_YOU_INDEX = 2;

export default class AppointmentEditModel {
  @observable
  newAppointmentTime;

  @observable
  wizardIndex = WIZARD_DATETIME_SELECTOR_INDEX;

  constructor({ service, selfServeModel } = {}) {
    this.appointmentDetails = new AppointmentDetailsModel({ service, selfServeModel });
    this.appointmentDetails.onAppointmentUpdated = appointment => {
      const { onAppointmentUpdated } = this;
      onAppointmentUpdated && onAppointmentUpdated(appointment);
    };
  }

  @action
  updateDateTime = dateTime => {
    this.newAppointmentTime = dateTime;
    this.moveNext();
  };

  loadAppointment = () => this.appointmentDetails.loadAppointment();

  @computed
  get newAppointmentTimeFormatted() {
    const { newAppointmentTime } = this;
    if (!newAppointmentTime) return '';

    return newAppointmentTime.format(trans('DEFAULT_APPOINTMENT_FORMAT', 'MMMM DD, YYYY [at] h:mm a'));
  }

  @action
  restartWizard = () => {
    this.wizardIndex = WIZARD_DATETIME_SELECTOR_INDEX;
    this.appointmentDetails.clearUpdateError();
  };

  @action
  moveNext = () => {
    this.wizardIndex++;
    if (this.wizardIndex > WIZARD_THANK_YOU_INDEX) {
      this.wizardIndex = WIZARD_THANK_YOU_INDEX;
    }
  };

  @action
  movePrev = () => {
    this.wizardIndex--;
    if (this.wizardIndex < WIZARD_DATETIME_SELECTOR_INDEX) {
      this.wizardIndex = WIZARD_DATETIME_SELECTOR_INDEX;
    }
  };

  @computed
  get appointmentLoading() {
    return this.appointmentDetails.appointmentLoading;
  }

  @computed
  get appoinmentStartFormatted() {
    return this.appointmentDetails.appoinmentStartFormatted;
  }

  @computed
  get appointmentLoaded() {
    return this.appointmentDetails.appointmentLoaded;
  }

  @computed
  get appointmentLoadingError() {
    return this.appointmentDetails.appointmentLoadingError;
  }

  @computed
  get isAppointmentCanceled() {
    const { appointmentDetails } = this;
    const { loadedAppointment = {} } = appointmentDetails;
    return loadedAppointment.state === 'Canceled';
  }

  @action
  performAppointmentUpdate = async () => {
    const { newAppointmentTime: dateTime, appointmentDetails } = this;

    await appointmentDetails.performAppointmentUpdate(dateTime);
    if (!appointmentDetails.appointmentUpdateError) {
      this.moveNext();
    }
  };

  @computed
  get appointmentUpdateLoading() {
    return this.appointmentDetails.appointmentUpdateLoading;
  }

  @computed
  get appointmentUpdateError() {
    return this.appointmentDetails.appointmentUpdateError;
  }
}
