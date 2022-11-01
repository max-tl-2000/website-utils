/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

import { observable, action, computed } from 'mobx';
import debounce from 'debouncy';

const THRESHOLD_TO_UPDATE_CALCULATED_INDEX = 16;

export default class SelfServeModel {
  @observable
  mode = 'create';

  @observable
  appointmentToken = '';

  @observable.shallow
  widgetDimensions = {};

  @observable
  _campaignEmail;

  @observable
  _programEmail;

  @observable
  marketingSessionId;

  @computed
  get propertyId() {
    return this._webSiteStore?.currentPropertyId;
  }

  constructor({ appointmentToken, mode = 'create', campaignEmail, marketingSessionId, webSiteStore }) {
    this.appointmentToken = appointmentToken;
    this.mode = mode;
    this._campaignEmail = campaignEmail;
    this.marketingSessionId = marketingSessionId;
    this._webSiteStore = webSiteStore;
  }

  @action
  setMode(mode) {
    this.mode = mode;
  }

  @action
  updateProgramEmail = programEmail => {
    this._programEmail = programEmail;
  };

  @computed
  get campaignEmail() {
    // the getAppointment endpoint return the program to be used
    // so we need to use the one we received there in that case
    // instead of the value received at creation time
    return this._programEmail || this._campaignEmail;
  }

  @computed
  get useLayoutSmall() {
    const { widgetDimensions } = this;
    return widgetDimensions.width < 500;
  }

  sameDimensions = (rect = {}) => {
    const { widgetDimensions } = this;
    return rect.width === widgetDimensions.width && rect.height === widgetDimensions.height;
  };

  @computed
  get isCreateMode() {
    return this.mode === 'create';
  }

  @computed
  get isEditMode() {
    return this.mode === 'edit';
  }

  @computed
  get isCancelMode() {
    return this.mode === 'cancel';
  }

  @action
  _storeDimensions = rect => {
    const { width, height } = rect;

    const dimensions = { width, height };
    if (this.sameDimensions(dimensions)) return;

    this.widgetDimensions = dimensions;
  };

  @action
  changeToCreateMode = () => {
    this.setMode('create');
  };

  storeDimensions = debounce(this._storeDimensions, THRESHOLD_TO_UPDATE_CALCULATED_INDEX);
}
