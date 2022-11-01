/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

import { computed, observable, action, reaction } from 'mobx';
import Request from '../common/request';
import ContactFormModel from './ContactFormModel';
import { now } from '../common/moment-utils';

export default class GuestCardModel {
  @observable
  form;

  @observable
  _termLengths;

  @observable
  _webSiteStore;

  @computed
  get loading() {
    return this.rqForm?.loading || this.rqSaveForm.loading;
  }

  @computed
  get formData() {
    return this.rqForm?.response;
  }

  @computed
  get termLengths() {
    return this._termLengths;
  }

  @computed
  get webSiteStore() {
    return this._webSiteStore;
  }

  @computed
  get propertyTimezone() {
    const { currentPropertyStore } = this.webSiteStore || {};
    const { timezone } = currentPropertyStore || {};
    return timezone;
  }

  @computed
  get showMoveInDate() {
    return this._showMoveInDate;
  }

  @computed
  get showMoveInRange() {
    return this._showMoveInRange;
  }

  moveInRangeValues = [
    { id: 'NEXT_4_WEEKS', value: 'Next 4 weeks' },
    { id: 'NEXT_2_MONTHS', value: 'Next 2 months' },
    { id: 'NEXT_4_MONTHS', value: 'Next 4 months' },
    { id: 'BEYOND_4_MONTHS', value: 'Beyond 4 months' },
    { id: 'I_DONT_KNOW', value: "I don't know" },
  ];

  constructor({ service, showExtraFields, shouldAllowComments, webSiteStore, showMoveInDate, showMoveInRange }) {
    this.showExtraFields = showExtraFields;
    this.shouldAllowComments = shouldAllowComments;
    this._showMoveInDate = showMoveInDate;
    this._showMoveInRange = showMoveInRange;

    this._webSiteStore = webSiteStore;

    if (service.getFormData) {
      this.rqForm = Request.create({
        call: () => service.getFormData(),
      });
    } else {
      this.createForm();
    }

    if (service.saveForm) {
      this.rqSaveForm = Request.create({
        call: (...args) => service.saveForm(...args),
      });
    } else {
      this.rqSaveForm = Request.create({
        call: (...args) => service.guestCard(...args),
      });
    }
  }

  @computed
  get saveFormError() {
    return this.rqSaveForm.error;
  }

  @action
  _setTermLengths = moveInDate => {
    const { timezone } = this;
    const today = now({ timezone }).startOf('day');
    moveInDate = moveInDate.clone().startOf('day');

    let daysDiff = moveInDate.diff(today, 'days');

    if (daysDiff < 0) {
      daysDiff = 0;
    }

    const multiplier = 1 + daysDiff * 0.01;

    const { termLengths } = this.formData;
    const MONTH_RENT = 2100;

    this._termLengths = termLengths.map(entry => ({
      ...entry,
      baseRent: MONTH_RENT * multiplier,
    }));
  };

  @action
  setTermLengths() {
    reaction(
      () => {
        const { moveInDate } = this.form;
        return {
          moveInDate,
        };
      },
      ({ moveInDate }) => {
        this._setTermLengths(moveInDate);
      },
    );

    const { moveInDate } = this.form;

    this._setTermLengths(moveInDate);
  }

  @computed
  get timezone() {
    return this.webSiteStore?.propertyTimezone;
  }

  @action
  createForm(webSiteStore) {
    const { timezone, showExtraFields, shouldAllowComments } = this;
    const store = webSiteStore || this.webSiteStore;

    // TODO: we pass a timezone here but is not used inside Please remove it
    // TODO: we also pass the websiteStore but is better to just pass initial data from this point if any
    this.form = new ContactFormModel({ showExtraFields, timezone, shouldAllowComments, webSiteStore: store });
  }

  @action
  saveForm = data => this.rqSaveForm.execCall({ ...data, propertyId: this.webSiteStore?.currentPropertyId });

  @action
  async loadForm() {
    const { rqForm } = this;
    if (!rqForm) return;
    await rqForm.execCall(); // this retrieves the data needed for the form
    try {
      this.createForm();
    } catch (err) {
      console.error('>>> ', err);
    }
  }
}
