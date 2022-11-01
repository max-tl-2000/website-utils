/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

import { computed } from 'mobx';
import { getImageForInventoryCarousel } from '../Website/helpers/images';

export default class WelcomePageModel {
  constructor(inventoryStore) {
    this._inventoryStore = inventoryStore;
  }

  _currency = '$';

  @computed
  get loading() {
    return this._inventoryStore.loading;
  }

  @computed
  get loaded() {
    return this._inventoryStore.inventoryLoaded;
  }

  @computed
  get inventoryInfo() {
    return this._inventoryStore?.inventoryInfo;
  }

  @computed
  get price() {
    return `${this._currency}${this.inventoryInfo.lowestMonthlyRent}`;
  }

  @computed
  get images() {
    return (this.inventoryInfo.imageUrls || []).map(img => ({ source: getImageForInventoryCarousel(img.url), alt: img.alt, metadata: img.metadata }));
  }

  @computed
  get videos() {
    return (this.inventoryInfo.videoUrls || []).map(video => ({ source: video.url }));
  }

  @computed
  get tours() {
    return (this.inventoryInfo['3DUrls'] || []).map(ddd => ({ source: ddd.url }));
  }

  @computed
  get amenities() {
    return (this.inventoryInfo.amenities || []).map(a => a.displayName);
  }
}
