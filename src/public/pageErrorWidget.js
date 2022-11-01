/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

import { getWebSiteStore } from '../Website/Stores/WebSiteStore';
import { renderComponent } from '../common/render-helper';
import PageErrorWidget from '../Website/Containers/PageErrorWidget/PageErrorWidget';

export const createPageErrorWidget = selector => {
  const webSiteStore = getWebSiteStore();
  renderComponent(PageErrorWidget, { selector, stores: { webSiteStore } });
};
