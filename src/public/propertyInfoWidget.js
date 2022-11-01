/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

import { getWebSiteStore } from '../Website/Stores/WebSiteStore';
import { renderPropertyDetails } from '../Website/Containers/PropertyDetails/PropertyDetails';
import { getTemplateFromElement } from '../common/interpolationHelper';

export const createPropertyInfoWidget = selector => {
  const { name, templateText, widgetEle } = getTemplateFromElement(selector);

  const webSiteStore = getWebSiteStore();

  return renderPropertyDetails({ webSiteStore, name, templateText, widgetEle });
};
