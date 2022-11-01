/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

import SelfServeModel from '../Models/SelfServeModel';
import { createEndpointsService } from '../Services/selfServeService';

import { DateTimeSelectorModel } from '../Models/DateTimeSelectorModel';
import { now } from '../common/moment-utils';
import TimezoneModel from '../Models/TimezoneModel';
import AppointmentCreateModel from '../Models/AppointmentCreateModel';
import AppointmentEditModel from '../Models/AppointmentEditModel';
import AppointmentCancelModel from '../Models/AppointmentCancelModel';
import CancelFeedbackModel from '../Models/CancelFeedbackModel';

export const createBookAppointmentStores = (params = {}) => {
  const { appointmentToken, mode, campaignEmail, dynamicFields, marketingSessionId, service, createAppointmentOnly, webSiteStore } = params;

  const timezoneModel = new TimezoneModel();
  const selfServeModel = new SelfServeModel({ appointmentToken, mode, campaignEmail, marketingSessionId, webSiteStore });

  const startDate = now();
  const dtSelectorModel = new DateTimeSelectorModel({ startDate, service, timezoneModel, selfServeModel });

  const appointmentCreateModel = new AppointmentCreateModel({ service, selfServeModel, webSiteStore }, { dynamicFields });

  let appointmentEditModel;
  let appointmentCancelModel;
  let cancelFeedbackModel;

  if (!createAppointmentOnly) {
    appointmentEditModel = new AppointmentEditModel({ service, selfServeModel });
    appointmentCancelModel = new AppointmentCancelModel({ service, selfServeModel });
    cancelFeedbackModel = new CancelFeedbackModel({ service, selfServeModel });
  }

  return {
    timezoneModel,
    appointmentEditModel,
    appointmentCreateModel,
    dtSelectorModel,
    selfServeModel,
    appointmentCancelModel,
    cancelFeedbackModel,
  };
};

export const createModels = params => {
  const { onEventRaised, onAppointmentSave, authToken, domain, ...rest } = params;

  const service = createEndpointsService(domain);

  service.setHeaders({
    Authorization: `Bearer ${authToken}`,
  });

  const stores = createBookAppointmentStores({ ...rest, service });
  const { appointmentCreateModel, appointmentEditModel, appointmentCancelModel, cancelFeedbackModel } = stores;

  const raiseEvent = evtData => {
    if (!onEventRaised) return;

    setTimeout(() => {
      try {
        onEventRaised(evtData);
      } catch (err) {
        console.error('onEventRaised: Event handler execution error', evtData);
      }
    }, 0); // just move it out of this turn of the loop
  };

  appointmentCreateModel.onAppointmentCreated = appointment => {
    raiseEvent({ type: 'APPOINTMENT_CREATED', payload: appointment });
  };

  appointmentEditModel.onAppointmentUpdated = appointment => {
    raiseEvent({ type: 'APPOINTMENT_UPDATED', payload: appointment });
  };

  appointmentCancelModel.onAppointmentCanceled = appointment => {
    raiseEvent({ type: 'APPOINTMENT_CANCELED', payload: appointment });
  };

  cancelFeedbackModel.onFeedbackShared = () => {
    raiseEvent({
      type: 'FEEDBACK_SHARED',
      payload: {
        ...appointmentCancelModel.appointmentDetails.loadedAppointment,
        state: 'Canceled',
      },
    });
  };

  if (onAppointmentSave) {
    appointmentCreateModel.onAppointmentSave = payload => {
      try {
        payload = onAppointmentSave(payload);
      } catch (err) {
        console.error('onAppointmentSave: Event handler execution error', payload);
      }
      return payload;
    };
  }

  return stores;
};
