/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

import { renderComponent } from '../common/render-helper';
import InventoryDialog from '../Website/Containers/InventoryDialog/InventoryDialog';
import { getWebSiteStore } from '../Website/Stores/WebSiteStore';

export const createInventoryDialogWidget = selector => {
  const webSiteStore = getWebSiteStore();
  renderComponent(InventoryDialog, { selector, stores: { webSiteStore } });
};
