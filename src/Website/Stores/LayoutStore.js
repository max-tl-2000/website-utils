/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

import { observable, computed, action, reaction } from 'mobx';
import { getWebSiteService } from '../../Services/WebSiteService';
import { serializeParams } from '../../common/serialize';
import { window } from '../../common/globals';
import { parseQuery } from '../../common/parseQuery';

import { createCacheableRequestForWebsiteUtils } from '../helpers/cacheableRequestHelper';

export default class LayoutStore {
  @computed
  get loading() {
    return this.inventoryRq.loading;
  }

  @computed
  get loaded() {
    return this.inventoryRq.success;
  }

  @observable.shallow
  selectedMarketingLayoutGroupId;

  @observable
  selectedInventoryId;

  constructor({ propertyStore }) {
    this.propertyStore = propertyStore;
    const webSiteService = getWebSiteService();

    this.inventoryRq = createCacheableRequestForWebsiteUtils({
      cachePrefix: 'propertyMarketingLayoutGroups',
      getId: () => {
        const { selectedMarketingLayoutGroupId } = this;
        if (!selectedMarketingLayoutGroupId || selectedMarketingLayoutGroupId.length === 0) throw new Error('No marketingLayoutGroupId provided');
        const marketingLayoutGroupId = selectedMarketingLayoutGroupId[0];
        const { propertyId } = propertyStore;

        return `${propertyId}_${marketingLayoutGroupId}`;
      },
      cacheTimeout: 1 * 60 * 1000,
      call: () => {
        const { propertyId } = propertyStore;
        const { selectedMarketingLayoutGroupId } = this;
        if (!selectedMarketingLayoutGroupId || selectedMarketingLayoutGroupId.length === 0) throw new Error('No marketingLayoutGroupId provided');
        const marketingLayoutGroupId = selectedMarketingLayoutGroupId[0];
        return webSiteService.getLayouts({ propertyId, marketingLayoutGroupId });
      },
      defaultResponse: [],
    });

    reaction(() => ({ marketingLayoutGroupId: this.selectedMarketingLayoutGroupId }), this.getInventoryInfo);
  }

  @action
  restoreFromQueryParams() {
    const { location } = window;
    const qParams = parseQuery(location.search);
    if (qParams.mktLayoutGroupId) {
      this.setSelectedMarketingLayoutGroup([qParams.mktLayoutGroupId]);
      this.getInventoryInfo();
    }

    if (qParams.inventoryId) {
      this.setSelectedInventoryId(qParams.inventoryId);
    }
  }

  @action
  reloadInventoryInfoIfNeeded() {
    const { selectedMarketingLayoutGroupId } = this;
    if (!selectedMarketingLayoutGroupId || selectedMarketingLayoutGroupId.length === 0) return;
    this.getInventoryInfo({ skipCache: true });
  }

  @computed
  get selectedLayouts() {
    return this.inventoryRq.response;
  }

  @action
  getInventoryInfo = ({ skipCache } = {}) => this.inventoryRq.execCall({ skipCache });

  @computed
  get shouldDisplayUnits() {
    return !!this.selectedMarketingLayoutGroupId;
  }

  @action
  setSelectedMarketingLayoutGroup(value) {
    this.selectedMarketingLayoutGroupId = value;
  }

  @action
  setSelectedInventoryId(inventoryId) {
    this.selectedInventoryId = inventoryId;
  }

  @action
  clearSelectedInventoryId() {
    this.selectedInventoryId = undefined;
  }

  // Commented out as was creating a lint error because teh action was doing nothing
  // @action
  // scheduleATour(unit) {
  // console.log('scheduleATour: ', unit);
  // }

  @computed
  get paramsForQueryString() {
    const { selectedInventoryId, selectedMarketingLayoutGroupId } = this;
    const [mktLayoutGroupId] = selectedMarketingLayoutGroupId || [];

    const params = {};
    if (mktLayoutGroupId) {
      params.mktLayoutGroupId = mktLayoutGroupId;
    }

    if (selectedInventoryId) {
      params.inventoryId = selectedInventoryId;
    }

    return serializeParams(params);
  }
}
