/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

import { renderComponent } from '../common/render-helper';
import Navigation from '../Website/Containers/Navigation/Navigation';
import { getWebSiteStore } from '../Website/Stores/WebSiteStore';

export const createNavigationWidget = (selector, { webSiteStore, onNavigationItemClick, columnTitle, columnValue, elevatingMarketsLayout = false }) => {
  webSiteStore = webSiteStore || getWebSiteStore();
  webSiteStore.setColumnTitleAndValue({ columnTitle, columnValue });
  renderComponent(Navigation, { selector, stores: { webSiteStore, actions: { onNavigationItemClick } }, props: { elevatingMarketsLayout } });
};
