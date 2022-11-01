/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

import { renderComponent } from '../common/render-helper';
import SearchResultList from '../Website/Containers/SearchResultList/SearchResultList';
import { getWebSiteStore } from '../Website/Stores/WebSiteStore';

export const createSearchResultListWidget = (selector, { onPropertyClick, on3DTourClick } = {}) => {
  const webSiteStore = getWebSiteStore();
  renderComponent(SearchResultList, { selector, stores: { webSiteStore, actions: { onPropertyClick, on3DTourClick } } });
};
