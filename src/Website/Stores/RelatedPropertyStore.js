/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

import { computed } from 'mobx';
import Request from '../../common/request';
import { getWebSiteService } from '../../Services/WebSiteService';

export default class RelatedPropertyStore {
  @computed
  get loading() {
    return this.relatedPropertiesRq.loading;
  }

  @computed
  get loaded() {
    return this.relatedPropertiesRq.success;
  }

  constructor({ propertyStore }) {
    this.propertyStore = propertyStore;
    const websiteService = getWebSiteService();

    this.relatedPropertiesRq = Request.create({
      defaultResponse: [], // although we should not reply with arrays directly
      call: async () => {
        try {
          return websiteService.getRelatedProperties({ propertyId: propertyStore.propertyId });
        } catch (error) {
          throw new Error('Error fetching related properties', error);
        }
      },
    });
  }

  @computed
  get error() {
    return this.relatedPropertiesRq.error;
  }

  loadProperties = () => {
    this.relatedPropertiesRq.execCall();
  };

  @computed
  get properties() {
    return this.relatedPropertiesRq.response || [];
  }
}
