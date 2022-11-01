/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

import { renderComponent } from '../common/render-helper';
import { getWebSiteStore } from '../Website/Stores/WebSiteStore';
import PropertyLogo from '../Website/Containers/PropertyLogo/PropertyLogo';

export const createPropertyLogoWidget = (
  selector,
  { scrollableParent, triggerElement, tenantLogoUrl, propertyLogoUrl, wrapInCloudinary = true, useDataURI = false, addCrossOriginHeader = false, onClick },
) => {
  const webSiteStore = getWebSiteStore();
  renderComponent(PropertyLogo, {
    selector,
    stores: { webSiteStore },
    props: { scrollableParent, triggerElement, tenantLogoUrl, propertyLogoUrl, wrapInCloudinary, useDataURI, addCrossOriginHeader, onClick },
  });
};
