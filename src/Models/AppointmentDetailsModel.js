/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

import { observable, action, computed } from 'mobx';

import { trans } from '../common/trans';
import Request from '../common/request';
import { toMoment } from '../common/moment-utils';

const NO_CHANGES_TOKEN = 'NO_CHANGES';

export default class AppointmentDetailsModel {
  @observable
  loadedAppointmentDateTime;

  constructor({ service, selfServeModel } = {}) {
    this.selfServeModel = selfServeModel;

    this.getAppointmentRq = Request.create({
      call: () => service.getAppointment({ token: selfServeModel.appointmentToken }),
      onResponse: this.handleAppointmentResponse,
    });

    this.updateAppointmentRq = Request.create({
      call: ({ ...rest }) => service.updateAppointment({ ...rest, token: selfServeModel.appointmentToken }),
    });

    this.cancelAppointmentRq = Request.create({
      call: () => service.cancelAppointment({ token: selfServeModel.appointmentToken }),
    });
  }

  @action
  handleAppointmentResponse = responseArgs => {
    const { response = {} } = responseArgs || {};
    this._setLoadedAppointment(response);
  };

  @action
  clearUpdateError = () => {
    this.updateAppointmentRq.clearError();
  };

  @computed
  get loadedAppointment() {
    return this.getAppointmentRq.response;
  }

  loadAppointment = async () => {
    const { getAppointmentRq } = this;

    await getAppointmentRq.execCall();
  };

  @action
  _setLoadedAppointment = appointmentResponse => {
    const { propertyTimeZone, startDate, programEmail } = appointmentResponse || {};

    if (!startDate) {
      console.warn('Response received but no startDate found');
      return;
    }

    this.selfServeModel.updateProgramEmail(programEmail);
    this.loadedAppointmentDateTime = toMoment(startDate, { timezone: propertyTimeZone });
  };

  @computed
  get appointmentLoading() {
    return this.getAppointmentRq.loading;
  }

  @computed
  get appoinmentStartFormatted() {
    const { loadedAppointmentDateTime } = this;
    if (!loadedAppointmentDateTime) return '';

    return loadedAppointmentDateTime.format(trans('DEFAULT_APPOINTMENT_FORMAT', 'MMMM DD, YYYY [at] h:mm a'));
  }

  @computed
  get appointmentLoaded() {
    return this.getAppointmentRq.success;
  }

  @computed
  get appointmentLoadingError() {
    const {
      getAppointmentRq: { error },
    } = this;

    if (error) {
      return `Error loading appointment: ${error}`;
    }

    return '';
  }

  @action
  performAppointmentUpdate = async dateTime => {
    const { updateAppointmentRq, onAppointmentUpdated, loadedAppointment } = this;
    const startDate = dateTime.toJSON();

    await updateAppointmentRq.execCall({ startDate });
    if (!updateAppointmentRq.error) {
      onAppointmentUpdated && onAppointmentUpdated({ ...loadedAppointment, startDate });
      this.updateLoadedAppointmentDate(dateTime);
    }
  };

  @action
  performAppointmentCancel = async () => {
    const { cancelAppointmentRq, onAppointmentCanceled, loadedAppointment } = this;

    await cancelAppointmentRq.execCall();
    if (cancelAppointmentRq.success) {
      onAppointmentCanceled && onAppointmentCanceled({ ...loadedAppointment, state: 'Canceled' });
    }
  };

  @action
  updateLoadedAppointmentDate = dateTime => {
    this.loadedAppointmentDateTime = dateTime;
  };

  @computed
  get appointmentUpdateLoading() {
    return this.updateAppointmentRq.loading;
  }

  @computed
  get appointmentUpdateError() {
    const {
      updateAppointmentRq: { error },
    } = this;

    if (!error) return '';

    switch (error) {
      case NO_CHANGES_TOKEN:
        return 'You already have an appointment scheduled for this time.';
      default:
        return `Error updating appointment: ${error}`;
    }
  }

  @computed
  get appointmentCancelLoading() {
    return this.cancelAppointmentRq.loading;
  }

  @computed
  get appointmentCancelError() {
    const {
      cancelAppointmentRq: { error },
    } = this;

    if (error) {
      return `Error canceling appointment: ${error}`;
    }

    return '';
  }
}
