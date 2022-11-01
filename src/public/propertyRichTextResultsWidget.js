/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

import { autorun } from 'mobx';
import { getWebSiteStore } from '../Website/Stores/WebSiteStore';

export const createPropertyRichTextResultsWidget = () => {
  const webSiteStore = getWebSiteStore();
  autorun(reaction => {
    const { propertyRichInfo } = webSiteStore.currentPropertyStore || {};
    if (!propertyRichInfo) return;

    const propertyRichInfoJson = JSON.stringify(propertyRichInfo);
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.innerHTML = propertyRichInfoJson;
    document.head.appendChild(script);
    reaction.dispose();
  });
};
