/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

import { observable, action, computed } from 'mobx';
import AppointmentDetailsModel from './AppointmentDetailsModel';

const WIZARD_FIRST_STEP = 0;
const WIZARD_LAST_STEP = 1;

export default class AppointmentCancelModel {
  @observable
  wizardIndex = WIZARD_FIRST_STEP;

  @computed
  get isAppointmentCanceled() {
    const { appointmentDetails } = this;
    const { loadedAppointment = {} } = appointmentDetails;
    return loadedAppointment.state === 'Canceled';
  }

  constructor({ service, selfServeModel } = {}) {
    this.appointmentDetails = new AppointmentDetailsModel({ service, selfServeModel });
    this.appointmentDetails.onAppointmentCanceled = appointment => {
      const { onAppointmentCanceled } = this;
      onAppointmentCanceled && onAppointmentCanceled(appointment);
    };
  }

  loadAppointment = () => this.appointmentDetails.loadAppointment();

  @action
  moveNext = () => {
    this.wizardIndex++;
    if (this.wizardIndex > WIZARD_LAST_STEP) {
      this.wizardIndex = WIZARD_LAST_STEP;
    }
  };

  @action
  movePrev = () => {
    this.wizardIndex--;
    if (this.wizardIndex < WIZARD_FIRST_STEP) {
      this.wizardIndex = WIZARD_FIRST_STEP;
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

  @action
  performAppointmentCancel = async () => {
    const { appointmentDetails } = this;

    await appointmentDetails.performAppointmentCancel();
    if (!appointmentDetails.appointmentCancelError) {
      this.moveNext();
    }
  };

  @computed
  get appointmentCancelLoading() {
    return this.appointmentDetails.appointmentCancelLoading;
  }

  @computed
  get appointmentCancelError() {
    return this.appointmentDetails.appointmentCancelError;
  }
}
