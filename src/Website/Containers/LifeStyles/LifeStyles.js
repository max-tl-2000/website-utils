/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

import React from 'react';
import './LifeStyles.scss';
import { renderAndTrack } from '../../../common/interpolationHelper';
import { renderComponent } from '../../../common/render-helper';
import LifeStyleIcon from './LifeStyleIcon';
import LifeStylesLoadingPlaceholder from './LifeStylesLoadingPlaceholder';
import AmenitiesLoadingPlaceholder from './AmenitiesLoadingPlaceholder';

export const renderLifeStyles = ({ webSiteStore, name, templateText, widgetEle }) =>
  renderAndTrack(widgetEle, {
    trackFn: () => {
      const { currentPropertyStore: propertyStore = {} } = webSiteStore;
      const { lifeStyles = [], layoutAmenities, propertyAmenities } = propertyStore;

      return {
        lifeStyles,
        layoutAmenities,
        propertyAmenities,
        layoutAmenitiesList: (layoutAmenities || []).map(la => la.displayName).join(', '),
        propertyAmenitiesList: (propertyAmenities || []).map(pa => pa.displayName).join(','),
        lifeStylesList: (lifeStyles || []).map(ls => ls.displayName).join(','),
        storeLoading: propertyStore.loading,
      };
    },
    template: { name, text: templateText },
    components: {
      lifeStyleIcon: ({ ele, markupData }) =>
        renderComponent(
          () => <LifeStyleIcon iconClassName={markupData.iconClassName} icon={markupData.icon || 'not-available'} displayName={markupData.displayName} />,
          { selector: ele },
        ),
      lifeStylesPh: ({ ele }) => renderComponent(() => <LifeStylesLoadingPlaceholder />, { selector: ele }),
      amenitiesPh: ({ ele }) => renderComponent(() => <AmenitiesLoadingPlaceholder />, { selector: ele }),
    },
  });
