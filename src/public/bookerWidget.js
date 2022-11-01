/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

import { renderComponent } from '../common/render-helper';
import { getWebSiteStore } from '../Website/Stores/WebSiteStore';
import BookerWidget from '../Website/Containers/BookerWidget/BookerWidget';
import { createBookAppointmentStores } from '../BookAppointment/createModels';
import { getSelfServeService } from '../Services/WebSiteService';

export const createBookerWidget = (selector, opts = {}) => {
  const webSiteStore = getWebSiteStore();

  const defaultFields = opts.addDefaultQuestion
    ? [
        {
          name: 'moveInTime',
          value: undefined,
          required: 'Move-in range is required',
          meta: {
            type: 'Dropdown',
            label: 'When do you plan to move in?*',
            items: [
              { id: 'NEXT_4_WEEKS', value: 'Next 4 weeks' },
              { id: 'NEXT_2_MONTHS', value: 'Next 2 months' },
              { id: 'NEXT_4_MONTHS', value: 'Next 4 months' },
              { id: 'BEYOND_4_MONTHS', value: 'Beyond 4 months' },
              { id: 'I_DONT_KNOW', value: "I don't know" },
            ],
          },
        },
      ]
    : [];

  const bookAppointmentStores = createBookAppointmentStores({
    service: getSelfServeService(),
    mode: opts.mode || 'create',
    createAppointmentOnly: false,
    dynamicFields: [...defaultFields, ...opts.dynamicFields],
    webSiteStore,
  });

  const { appointmentCreateModel, appointmentEditModel, appointmentCancelModel, cancelFeedbackModel } = bookAppointmentStores;

  const raiseEvent = evtData => {
    if (!opts.onEventRaised) return;

    setTimeout(() => {
      try {
        opts.onEventRaised(evtData);
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

  if (opts.onAppointmentSave) {
    appointmentCreateModel.onAppointmentSave = payload => {
      try {
        payload = opts.onAppointmentSave(payload);
      } catch (err) {
        console.error('onAppointmentSave: Event handler execution error', payload);
      }
      return payload;
    };
  }

  renderComponent(BookerWidget, { selector, stores: { webSiteStore, ...bookAppointmentStores } });
};
