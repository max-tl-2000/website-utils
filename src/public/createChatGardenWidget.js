/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

import { renderComponent } from '../common/render-helper';
import ChatGardenWidget from '../Website/Containers/ChatGardenWidget/ChatGardenWidget';
import { createBookAppointmentStores } from '../BookAppointment/createModels';
import { getChatGardenStore } from '../Website/Stores/ChatGardenStore';
import { getWebSiteStore } from '../Website/Stores/WebSiteStore';
import { getSelfServeService } from '../Services/WebSiteService';

export const createChatGardenWidget = (selector, props) => {
  const webSiteStore = getWebSiteStore();
  const chatGardenStore = getChatGardenStore();
  const bookAppointmentStores = createBookAppointmentStores({
    service: getSelfServeService(),
    mode: 'create',
    createAppointmentOnly: false,
    webSiteStore,
  });

  renderComponent(ChatGardenWidget, { selector, props, stores: { webSiteStore, chatGardenStore, ...bookAppointmentStores } });
};
