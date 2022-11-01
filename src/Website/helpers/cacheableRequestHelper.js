/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

import { createCacheableRequest } from '../../common/cacheableRequest';
import { getWebSiteService } from '../../Services/WebSiteService';

export const createCacheableRequestForWebsiteUtils = args => {
  if (!args) throw new Error('no parameters provided to createCacheableRequestForWebsiteUtils');

  const getMarketingSessionId = async () => {
    const websiteService = getWebSiteService();
    const { marketingSessionId } = await websiteService.getMarketingSession();
    if (!marketingSessionId) throw new Error('MarketingSessionId should be defined but it is not');
    return marketingSessionId;
  };

  return createCacheableRequest({
    ...args,
    hasExpiredFn: async (entry, params = {}) => {
      if (params?.skipCache) return true; // this forces the cache to be cleared
      const marketingSessionId = await getMarketingSessionId();
      return entry.mktSessionId !== marketingSessionId;
    },
    onBeforeCacheEntrySave: async entry => {
      const marketingSessionId = await getMarketingSessionId();

      entry.mktSessionId = marketingSessionId;
    },
  });
};
