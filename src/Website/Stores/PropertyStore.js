/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

import { observable, computed } from 'mobx';
import { getWebSiteService } from '../../Services/WebSiteService';
import RelatedPropertyStore from './RelatedPropertyStore';
import LayoutStore from './LayoutStore';
import { createCacheableRequestForWebsiteUtils } from '../helpers/cacheableRequestHelper';
import { appState } from './AppState';
import { asMoney, defaultCurrencyFormatterOpts, formatHours, formatTime } from '../../common/format';
import { parseAPhone } from '../../common/phone/phone-helper';

export default class PropertyStore {
  @computed
  get loading() {
    return this.propertyRq.loading;
  }

  @computed
  get loaded() {
    return this.propertyRq.success;
  }

  @observable
  propertyId;

  constructor({ propertyId, webSiteStore }) {
    this.webSiteStore = webSiteStore;
    this.propertyId = propertyId;
    const websiteService = getWebSiteService();

    this.propertyRq = createCacheableRequestForWebsiteUtils({
      cachePrefix: 'propertyRq',
      getId: () => this.propertyId,
      cacheTimeout: 60 * 60 * 1000,
      call: async () => websiteService.getPropertyInfo({ propertyId: this.propertyId }),
      onResponse: args => {
        const { response } = args;
        const { marketingLayoutGroups = [], city, state, displayName, propertyId: pid } = response || {};

        this.queryLabel = { query: { city, state, propertyId: pid }, label: displayName };

        if (!response?.phone) {
          if (args.response) {
            args.response.phone = appState?.session?.phone;
          }
        }

        if (marketingLayoutGroups.length !== 1) return;

        this.layoutStore.setSelectedMarketingLayoutGroup([marketingLayoutGroups[0].id]);
      },
    });

    this.relatedPropertiesStore = new RelatedPropertyStore({ propertyStore: this });
    this.layoutStore = new LayoutStore({ propertyStore: this });
  }

  loadPropertyInfo = () => {
    this.propertyRq.execCall();
  };

  @computed
  get property() {
    return this.propertyRq.response;
  }

  @computed
  get lifeStyles() {
    return (this.property || {}).lifestyles || [];
  }

  @computed
  get layoutAmenities() {
    return this.property?.layoutAmenities || [];
  }

  @computed
  get propertyAmenities() {
    return this.property?.propertyAmenities || [];
  }

  @computed
  get marketingLayoutGroups() {
    return (this.property || {}).marketingLayoutGroups || [];
  }

  @computed
  get timezone() {
    return (this.property || {}).timezone;
  }

  @computed
  get phone() {
    return (this.property || {}).phone;
  }

  @computed
  get error() {
    return this.propertyRq.error;
  }

  @computed
  get propertyRichInfo() {
    if (this.propertyRq.error) return null;

    const { displayName, address, geoLocation, imageUrl, slugUrl, facebookURL, instagramURL, googleReviewsURL, team, marketRent, phone } = this.property || {};
    if (!displayName) return null;

    const { location } = window;
    const { hours } = team || {};
    const { Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday } = hours || {};

    return {
      '@context': 'http://schema.org',
      '@type': 'LocalBusiness',
      name: displayName,
      address: {
        '@type': 'PostalAddress',
        streetAddress: address?.addressLine2,
        addressLocality: address?.addressLine1,
        addressRegion: address?.state,
        postalCode: address?.zip,
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: geoLocation?.lat,
        longitude: geoLocation?.lng,
      },
      image: imageUrl,
      telePhone: parseAPhone(phone).format(),
      url: `${location.protocol}//${location.hostname}${slugUrl}`,
      sameAs: [facebookURL, instagramURL, googleReviewsURL],
      openingHours: formatHours(hours),
      openingHoursSpecification: [
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: 'http://schema.org/Monday',
          opens: formatTime(Monday?.startTime),
          closes: formatTime(Monday?.endTime),
        },
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: 'http://schema.org/Tuesday',
          opens: formatTime(Tuesday?.startTime),
          closes: formatTime(Tuesday?.endTime),
        },
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: 'http://schema.org/Wednesday',
          opens: formatTime(Wednesday?.startTime),
          closes: formatTime(Wednesday?.endTime),
        },
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: 'http://schema.org/Thursday',
          opens: formatTime(Thursday?.startTime),
          closes: formatTime(Thursday?.endTime),
        },
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: 'http://schema.org/Friday',
          opens: formatTime(Friday?.startTime),
          closes: formatTime(Friday?.endTime),
        },
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: 'http://schema.org/Saturday',
          opens: formatTime(Saturday?.startTime),
          closes: formatTime(Saturday?.endTime),
        },
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: 'http://schema.org/Sunday',
          opens: formatTime(Sunday?.startTime),
          closes: formatTime(Sunday?.endTime),
        },
      ],
      priceRange: asMoney(marketRent?.min || 0, { ...defaultCurrencyFormatterOpts, minimumFractionDigits: 0 }),
    };
  }

  @observable.shallow
  queryLabel;
}
