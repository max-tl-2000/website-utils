/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

import { getWebSiteStore } from '../Website/Stores/WebSiteStore';
import { getTemplateFromElement } from '../common/interpolationHelper';
import { renderSearchDetails } from '../Website/Containers/SearchBoxFilter/SearchBoxFilterDetails';

export const createSearchInfoWidget = selector => {
  const { name, templateText, widgetEle } = getTemplateFromElement(selector);

  const webSiteStore = getWebSiteStore();
  return renderSearchDetails({ webSiteStore, name, templateText, widgetEle });
};
