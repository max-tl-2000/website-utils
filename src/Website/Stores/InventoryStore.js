/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

import { computed, action, observable, toJS } from 'mobx';
import Request from '../../common/request';
import { getWebSiteService, getSelfServeService } from '../../Services/WebSiteService';
import QuestionsPageModel from '../../Models/QuestionsPageModel';

export default class InventoryStore {
  @observable
  inventoryId;

  constructor({ inventoryId, webSiteStore } = {}) {
    if (!inventoryId) throw new Error('param inventoryId is required');

    this.inventoryId = inventoryId;
    this.webSiteStore = webSiteStore;

    const webSiteService = getWebSiteService();
    const selfServeService = getSelfServeService();

    this.rq = Request.create({
      call: () => webSiteService.getInventory({ inventoryId: this.inventoryId, propertyId: webSiteStore.currentPropertyId }),
    });

    this.marketingQuestionsRq = Request.create({
      call: () => webSiteService.getMarketingQuestions({ inventoryId: this.inventoryId, propertyId: webSiteStore.currentPropertyId }),
      onResponse: args => {
        if (args.response) args.response = new QuestionsPageModel(args.response);
      },
    });

    this.inventoryPricingRq = Request.create({
      call: moveInDate => webSiteService.getInventoryPricing({ inventoryId: this.inventoryId, moveInDate, propertyId: webSiteStore.currentPropertyId }),
    });

    this.requestQuoteRq = Request.create({
      call: data => selfServeService.guestCard({ ...data, propertyId: webSiteStore.currentPropertyId }),
    });
  }

  destroy() {
    this.webSiteStore = null; // remove reference to parent store to prevent leaks
  }

  @computed
  get inventoryInfo() {
    return this.rq.response;
  }

  @computed
  get rawInventoryInfo() {
    return toJS(this.inventoryInfo);
  }

  @computed
  get inventoryLoaded() {
    return this.rq.success;
  }

  @computed
  get loading() {
    return this.rq.loading;
  }

  @computed
  get error() {
    return this.rq.error;
  }

  @action
  loadInventory() {
    return this.rq.execCall();
  }

  @computed
  get marketingQuestions() {
    return this.marketingQuestionsRq.response;
  }

  @computed
  get loadingMarketingQuestions() {
    return this.marketingQuestionsRq.loading;
  }

  @computed
  get errorLoadingMarketingQuestions() {
    return this.marketingQuestionsRq.error;
  }

  @computed
  get loadedMarketingQuestions() {
    return this.marketingQuestionsRq.success;
  }

  @action
  loadMarketingQuestions() {
    return this.marketingQuestionsRq.execCall();
  }

  @computed
  get inventoryPricing() {
    return this.inventoryPricingRq.response;
  }

  @computed
  get loadingInventoryPricing() {
    return this.inventoryPricingRq.loading;
  }

  @computed
  get loadInventoryPricingError() {
    return this.inventoryPricingRq.error;
  }

  @computed
  get loadedInventoryPricing() {
    return this.inventoryPricingRq.success;
  }

  @action
  loadInventoryPricing(moveInDate) {
    return this.inventoryPricingRq.execCall(moveInDate.format('YYYY-MM-DD'));
  }

  @action
  requestQuote(requestData) {
    return this.requestQuoteRq.execCall(requestData);
  }

  @computed
  get requestQuoteError() {
    return this.requestQuoteRq.error;
  }
}
