/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

import { renderComponent } from '../common/render-helper';
import { getWebSiteStore } from '../Website/Stores/WebSiteStore';
import ContactFormDialog from '../Forms/ContactFormDialog';
import GuestCardModel from '../Models/GuestCardModel';
import { getSelfServeService } from '../Services/WebSiteService';

export const createContactUsWidget = (selector, props) => {
  const webSiteStore = getWebSiteStore();
  const guestCardModel = new GuestCardModel({
    service: getSelfServeService(),
    showExtraFields: false,
    shouldAllowComments: true,
    webSiteStore,
    showMoveInRange: true,
  });
  renderComponent(ContactFormDialog, { selector, stores: { webSiteStore, guestCardModel }, props });
};
