/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

import { renderComponent } from '../common/render-helper';
import InventorySelector from '../Website/Containers/InventorySelector/InventorySelector';
import { getWebSiteStore } from '../Website/Stores/WebSiteStore';
import { createBookAppointmentStores } from '../BookAppointment/createModels';
import { getSelfServeService } from '../Services/WebSiteService';

export const createInventorySelectorWidget = selector => {
  const webSiteStore = getWebSiteStore();
  const bookAppointmentStores = createBookAppointmentStores({
    webSiteStore,
    service: getSelfServeService(),
    mode: 'create',
    createAppointmentOnly: true,
    dynamicFields: [
      {
        name: 'moveInTime',
        value: undefined,
        required: 'Move-in range is required',
        meta: {
          big: true,
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
    ],
  });
  renderComponent(InventorySelector, { selector, stores: { webSiteStore, ...bookAppointmentStores } });
};
