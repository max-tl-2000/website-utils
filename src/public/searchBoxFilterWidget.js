/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

import { renderComponent } from '../common/render-helper';
import { getWebSiteStore } from '../Website/Stores/WebSiteStore';
import SearchBoxFilter from '../Website/Containers/SearchBoxFilter/SearchBoxFilter';

export const createSearchBoxFilterWidget = (selector, { inputClassName } = {}) => {
  const webSiteStore = getWebSiteStore();
  renderComponent(SearchBoxFilter, { selector, stores: { webSiteStore }, props: { inputClassName } });
};
