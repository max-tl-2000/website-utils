/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

import { renderComponent } from '../common/render-helper';
import { getWebSiteStore } from '../Website/Stores/WebSiteStore';
import ScheduleTourWidget, { ScheduleTourDialog } from '../Website/Containers/ScheduleTourWidget/ScheduleTourWidget';
import { createBookAppointmentStores } from '../BookAppointment/createModels';
import { getSelfServeService } from '../Services/WebSiteService';
import { DialogModel } from '../common/DialogModel';

export const createScheduleTourWidget = (selector, { opts, markupData }) => {
  const webSiteStore = getWebSiteStore();
  const options = opts || { addDefaultQuestion: true, dynamicFields: [] };
  const defaultFields = options.addDefaultQuestion
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
    mode: 'create',
    createAppointmentOnly: false,
    dynamicFields: [...defaultFields, ...(options.dynamicFields || [])],
    webSiteStore,
  });

  const { appointmentCreateModel } = bookAppointmentStores;

  const raiseEvent = evtData => {
    if (!options.onEventRaised) return;

    setTimeout(() => {
      try {
        options.onEventRaised(evtData);
      } catch (err) {
        console.error('onEventRaised: Event handler execution error', evtData);
      }
    }, 0); // just move it out of this turn of the loop
  };

  appointmentCreateModel.onAppointmentCreated = appointment => {
    raiseEvent({ type: 'APPOINTMENT_CREATED', payload: appointment });
  };

  if (options.onAppointmentSave) {
    appointmentCreateModel.onAppointmentSave = payload => {
      try {
        payload = options.onAppointmentSave(payload);
      } catch (err) {
        console.error('onAppointmentSave: Event handler execution error', payload);
      }
      return payload;
    };
  }

  const Cmpnt = options.useDialog ? ScheduleTourDialog : ScheduleTourWidget;

  const dlgModel = options.useDialog ? new DialogModel() : undefined;

  renderComponent(Cmpnt, { selector, stores: { webSiteStore, ...bookAppointmentStores }, props: { markupData, dlgModel } });

  return dlgModel;
};
