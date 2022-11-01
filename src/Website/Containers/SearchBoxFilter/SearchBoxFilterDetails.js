/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

import { renderAndTrack } from '../../../common/interpolationHelper';
export const renderSearchDetails = ({ webSiteStore, name, templateText, widgetEle }) =>
  renderAndTrack(widgetEle, {
    trackFn: () => {
      const { searchStore } = webSiteStore;
      const { queryLabel } = searchStore;
      return {
        queryLabel: queryLabel && queryLabel.label,
        storeLoading: searchStore.loading,
      };
    },
    template: { name, text: templateText },
  });
