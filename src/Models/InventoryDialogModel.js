/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

import { observable, computed, action } from 'mobx';
import WelcomePageModel from './WelcomePageModel';
import GuestCardModel from './GuestCardModel';
import { getSelfServeService } from '../Services/WebSiteService';
import SelectionModel from '../components/SelectionGroup/SelectionModel';
import { parseAsInTimezone, now } from '../common/moment-utils';
import { selectionGroupValues } from '../Website/Containers/InventoryDialog/PersonalizedPrice/PrimaryQuestion';
import { trans } from '../common/trans';

export default class InventoryDialogModel {
  constructor(inventoryStore, inventoryId) {
    this._inventoryStore = inventoryStore;
    this._inventoryId = inventoryId;

    this.inventoryStore?.loadMarketingQuestions();
  }

  @observable
  _inventoryId;

  @observable
  _welcomePageModel;

  @observable
  _selectedTermLengths = [];

  @observable
  _expandTerms = false;

  @computed
  get selectedTermLengths() {
    return this._selectedTermLengths;
  }

  @computed
  get expandTerms() {
    return this._expandTerms;
  }

  @action
  setExpandTerms = value => {
    this._expandTerms = value;
  };

  @action
  addToSelectedTermLengths = length => {
    this._selectedTermLengths.push(length);
  };

  @action
  removeFromSelectedTermLengths = length => {
    this._selectedTermLengths = this.selectedTermLengths.filter(i => i !== length);
  };

  @computed
  get loading() {
    return this._inventoryStore?.loading;
  }

  @computed
  get webSiteStore() {
    return this._inventoryStore?.webSiteStore;
  }

  @computed
  get propertyTimezone() {
    const { currentPropertyStore } = this.webSiteStore;
    const { timezone } = currentPropertyStore;
    return timezone;
  }

  @computed
  get getDomain() {
    return this._domain;
  }

  @computed
  get getToken() {
    return this._token;
  }

  @computed
  get inventoryStore() {
    return this._inventoryStore;
  }

  @computed
  get inventoryInfo() {
    return this._inventoryStore?.inventoryInfo;
  }

  @computed
  get buildingQualifiedName() {
    return this.inventoryInfo.buildingQualifiedName;
  }

  @computed
  get welcomePageModel() {
    if (!this._welcomePageModel) {
      this._welcomePageModel = new WelcomePageModel(this._inventoryStore);
    }

    return this._welcomePageModel;
  }

  @computed
  get questionsPageModel() {
    if (!this._questionsPageModel) {
      if (this.inventoryStore?.loadedMarketingQuestions) {
        this._questionsPageModel = this.inventoryStore?.marketingQuestions;
      }
    }
    return this._questionsPageModel;
  }

  @computed
  get guestCardModel() {
    if (!this._guestCardModel) {
      this._guestCardModel = new GuestCardModel({
        service: getSelfServeService(),
        showExtraFields: false,
        shouldAllowComments: false,
        webSiteStore: this.webSiteStore,
        showMoveInDate: true,
      });
    }
    return this._guestCardModel;
  }

  @computed
  get inventoryPricing() {
    return this.inventoryStore?.inventoryPricing;
  }

  @computed
  get moveInDate() {
    return this.inventoryStore?.webSiteStore.moveInDate || now({ timezone: this.propertyTimezone });
  }

  @action
  setMoveInDate(value) {
    this.inventoryStore?.webSiteStore.setMoveInDate(value);
  }

  @action
  async loadInventoryPricing() {
    await this.inventoryStore?.loadInventoryPricing(this.moveInDate);
  }

  @computed
  get suggestedMoveInDate() {
    const inventoryAvailabilityDate = this.inventoryInfo.availabilityDate
      ? parseAsInTimezone(this.inventoryInfo.availabilityDate, { parseFormat: 'YYYY-MM-DD', timezone: this.propertyTimezone })
      : null;

    const pricingAvailabilityDate =
      this.inventoryPricing.date && parseAsInTimezone(this.inventoryPricing.date, { parseFormat: 'YYYY-MM-DD', timezone: this.propertyTimezone });

    // if there is no inventoryAvailability, suggested move in is dictated by priceMatrix alone
    if (!inventoryAvailabilityDate) return pricingAvailabilityDate;

    // if both availability dates are present ( inventory and pricing), suggested move in date will be determined by the latest of the two.
    const pricingDate = pricingAvailabilityDate || parseAsInTimezone(this.moveInDate, { parseFormat: 'YYYY-MM-DD', timezone: this.propertyTimezone });

    return inventoryAvailabilityDate.isSameOrBefore(pricingDate, 'day') ? pricingDate : inventoryAvailabilityDate;
  }

  @computed
  get unitUnavailableText() {
    return trans(
      'UNIT_UNAVAILABLE',
      'This unit is unavailable for the date that you selected, so we’ve reset it to the earliest date this unit becomes available.',
    );
  }

  @computed
  get exactRentUnavailableText() {
    return trans(
      'EXACT_RENT_UNAVAILABLE',
      'Exact rent is unavailable for the date that you selected, so we’ve reset it to the closest date with an available rent.',
    );
  }

  @computed
  get pricingUnavailableText() {
    return trans('PRICING_UNAVAILABLE', 'Pricing cannot be retrieved at this time');
  }

  @computed
  get pricingDateMessage() {
    if (!this.inventoryPricing) return this.pricingUnavailableText;

    const availabilityDate = this.suggestedMoveInDate;
    if (!availabilityDate) return '';

    if (this.moveInDate.isSame(availabilityDate, 'day')) return '';

    if (this.moveInDate.isBefore(availabilityDate, 'day')) {
      return this.unitUnavailableText;
    }
    if (this.moveInDate.isAfter(availabilityDate, 'day')) {
      return this.exactRentUnavailableText;
    }
    return '';
  }

  @computed
  get termsModel() {
    const inventoryPricing = this.inventoryPricing;
    const { terms = [], additionalTerms = [] } = inventoryPricing;
    const defaultTerms = terms.map(term => ({ ...term, isDefaultTerm: true }));
    const items = defaultTerms.concat(additionalTerms).sort((a, b) => b.termLength - a.termLength);

    this._terms = new SelectionModel({
      items,
      multiple: true,
      textField: 'period',
      valueField: 'termLength',
    });

    this._terms.items.filter(term => this.selectedTermLengths.includes(term.id)).map(term => this._terms.select(term.id, true));

    return {
      inventoryPricing: this._terms,
      moveInDate: this.moveInDate,
      setMoveInDate: value => {
        this.setMoveInDate(value);
        this.loadInventoryPricing();
      },
      suggestedMoveInDate: this.suggestedMoveInDate,
      closestDateMessage: this.pricingDateMessage,
      propertyTimezone: this.propertyTimezone,
      selectedTermLengths: this.selectedTermLengths,
      addToSelectedTermLengths: this.addToSelectedTermLengths,
      removeFromSelectedTermLengths: this.removeFromSelectedTermLengths,
      expandTerms: this.expandTerms,
      setExpandTerms: this.setExpandTerms,
    };
  }

  @computed
  get termLength() {
    const { termLength } = this.termsModel?.inventoryPricing?.selection?.items[0] || {};
    return termLength;
  }

  @computed
  get layoutStore() {
    const { webSiteStore } = this;
    const currentPropertyStore = webSiteStore?.currentPropertyStore;
    return currentPropertyStore?.layoutStore;
  }

  @computed
  get numBedrooms() {
    if (!this.layoutStore) return [];
    const { selectedLayouts } = this.layoutStore;

    return selectedLayouts[0]?.numBedrooms;
  }

  @action
  convertNumBedrooms = numBedrooms => {
    if (!numBedrooms?.length) return [];
    const numBedroomsStrings = ['STUDIO', 'ONE_BED', 'TWO_BEDS', 'THREE_BEDS', 'FOUR_PLUS_BEDS'];

    return numBedrooms.map(numBedroom => numBedroomsStrings[numBedroom]);
  };

  @computed
  get moveInTimeRange() {
    const moveInDate = this.suggestedMoveInDate || this.moveInDate;
    if (!moveInDate) return 'I_DONT_KNOW';

    const nowAtProperty = this.inventoryStore.webSiteStore.nowAtProperty;
    const numberOfWeeks = moveInDate.diff(nowAtProperty, 'week');

    if (numberOfWeeks <= 4) return 'NEXT_4_WEEKS';
    if (numberOfWeeks <= 8) return 'NEXT_2_MONTHS';
    if (numberOfWeeks <= 16) return 'NEXT_4_MONTHS';
    return 'BEYOND_4_MONTHS';
  }

  @computed
  get webInquiryData() {
    const selectedSections = this.questionsPageModel?.getSectionModels.filter(s => !s.getSectionQuestion || s.getSectionAnswer);
    const feesAndCounts = selectedSections.reduce((fees, q) => {
      q.getPrimaryQuestions
        .filter(p => p.getPrimaryAnswer === selectionGroupValues.YES)
        .forEach(followup => fees.push({ feeId: followup.getFeeId, count: followup.getFollowupAnswer || 1 }));
      return fees;
    }, []);

    const contactData = this.guestCardModel?.form?.serializedData;
    const selectedTerms = this.termsModel?.inventoryPricing?.selection?.items;

    return {
      name: contactData.name,
      email: contactData.email,
      phone: contactData.phone,
      unitId: this.inventoryInfo.name,
      qualificationQuestions: {
        moveInTime: this.moveInTimeRange,
        numBedrooms: this.convertNumBedrooms(this.numBedrooms),
        cashAvailable: 'UNKNOWN',
        groupProfile: 'NOT_YET_DETERMINED',
      },
      requestQuote: {
        unitQualifiedName: this.inventoryInfo.fullQualifiedName,
        marketingQuestionsResponses: feesAndCounts,
        termLength: selectedTerms.map(t => t.termLength),
        petCount: 0,
        moveInDate: this.suggestedMoveInDate || this.moveInDate,
      },
    };
  }

  @action
  async submitSelections() {
    await this.inventoryStore?.requestQuote(this.webInquiryData);
  }

  @computed
  get loadInventoryError() {
    return this.inventoryStore.error;
  }

  @computed
  get loadInventoryPricingError() {
    return this.inventoryStore.loadInventoryPricingError;
  }

  @computed
  get requestQuoteError() {
    return this.inventoryStore.requestQuoteError;
  }

  @computed
  get error() {
    return this.inventoryStore.requestQuoteError || this.inventoryStore.loadInventoryPricingError || this.inventoryStore.error;
  }

  @action
  updateStore = formData => {
    const { webSiteStore } = this;
    if (webSiteStore) {
      webSiteStore.setFullName(formData.name);
      webSiteStore.setEmail(formData.email);
      webSiteStore.setPhoneNo(formData.phone);
      webSiteStore.setMoveInDate(formData.moveInDate);
    }
  };
}
