/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

import SearchMap from '../Website/Containers/Map/SearchMap';
import PropertyMap from '../Website/Containers/Map/PropertyMap';
import { renderComponent } from '../common/render-helper';
import { getWebSiteStore } from '../Website/Stores/WebSiteStore';

export const createSearchMapWidget = (selector, { onPropertyClick } = {}) => {
  const webSiteStore = getWebSiteStore();

  renderComponent(SearchMap, { selector, stores: { webSiteStore, searchStore: webSiteStore.searchStore, actions: { onPropertyClick } } });
};

export const createPropertyMapWidget = (selector, { onPropertyClick } = {}) => {
  renderComponent(PropertyMap, { selector, stores: { webSiteStore: getWebSiteStore(), actions: { onPropertyClick } } });
};
