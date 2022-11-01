/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

import React from 'react';
import './PropertyDetails.scss';
import { renderAndTrack } from '../../../common/interpolationHelper';
import { asMoney, formatHours } from '../../../common/format';
import { createSearchBoxWidget } from '../../../public/searchBoxWidget';
import { renderComponent } from '../../../common/render-helper';
import { navigateTo } from '../../helpers/navigator';
import { PhoneButtonComponent } from '../../Components/PhoneButton/PhoneButton';
import ShareLinkDialogContainer from '../ShareLinkDialogContainer/ShareLinkDialogContainer';
import SocialMediaIcons from '../SocialMediaIcons/SocialMediaIcons';
import LinkToButton from '../../Components/LinkToButton/LinkToButton';
import { createContactUsWidget } from '../../../public/contactUsWidget';
import { createScheduleTourWidget } from '../../../public/scheduleTourWidget';
import PropertyDetailsLoadingPlaceholder from './PropertyDetailsLoadingPlaceholder';
import { SubContexts } from '../../helpers/tracking-helper';

export const renderPropertyDetails = ({ webSiteStore, name, templateText, widgetEle }) =>
  renderAndTrack(widgetEle, {
    trackFn: () => {
      const { currentPropertyStore: propertyStore = {} } = webSiteStore;
      const { queryLabel, property = {} } = propertyStore;
      const { phone: propertyPhone, formattedLongAddress, marketRent = {}, team: { hours: teamOfficeHours } = {}, officeHours, smsEnabled } = property;
      const propertyStartingPrice = asMoney(marketRent.min, { minimumFractionDigits: 0 });
      const propertyStartingPriceString = marketRent.min ? `Starting at ${propertyStartingPrice} (check availability)` : '';

      return {
        propertyOfficeHours: officeHours || formatHours(teamOfficeHours),
        queryLabel,
        propertyPhone,
        smsEnabled,
        propertyAddress: formattedLongAddress,
        propertyStartingPriceString,
        storeLoading: propertyStore.loading,
      };
    },
    template: { name, text: templateText },
    components: {
      searchBox: ({ ele, data }) =>
        createSearchBoxWidget(ele, {
          inputClassName: data?.inputClassName,
          selectedItem: data?.queryLabel,
          onSuggestionClick: ({ url }) => navigateTo(url),
          subContext: SubContexts.PROPERTY_DETAILS_HEADER,
        }),
      btnLinkTo: ({ ele, markupData }) => renderComponent(() => <LinkToButton {...markupData} />, { selector: ele }),
      labelPhone: ({ ele, markupData, data }) =>
        renderComponent(
          () => (
            <PhoneButtonComponent
              phone={markupData.phone}
              webSiteStore={webSiteStore}
              subContext={SubContexts.PROPERTY_DETAILS_HEADER}
              smsEnabled={data?.smsEnabled}
            />
          ),
          {
            selector: ele,
          },
        ),
      scheduleATour: ({ ele, markupData, data }) => createScheduleTourWidget(ele, { opts: data.opts, markupData }),
      btnShareURL: ({ ele, markupData }) => renderComponent(() => <ShareLinkDialogContainer label={markupData.label} />, { selector: ele }),
      btnContactUs: ({ ele, data }) => createContactUsWidget(ele, { phone: data.propertyPhone, smsEnabled: data.smsEnabled }),
      propertyDetailsPlaceholder: ({ ele }) => renderComponent(() => <PropertyDetailsLoadingPlaceholder />, { selector: ele }),
      socialMediaIcons: ({ ele, markupData }) => renderComponent(() => <SocialMediaIcons webSiteStore={webSiteStore} {...markupData} />, { selector: ele }),
    },
  });
