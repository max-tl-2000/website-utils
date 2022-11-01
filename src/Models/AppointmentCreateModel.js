/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

import isEqual from 'lodash/isEqual';
import { observable, action, computed, runInAction } from 'mobx';

import AppointmentFormModel from './AppointmentFormModel';

import { trans } from '../common/trans';
import Request from '../common/request';

const WIZARD_DATETIME_SELECTOR_INDEX = 0;
const WIZARD_THANK_YOU_INDEX = 2;

const DUPLICATE_APPOINTMENT_TOKEN = 'DUPLICATE_APPOINTMENT';
const SLOT_UNAVAILABLE_TOKEN = 'SLOT_NOT_AVAILABLE';
const MISSING_INVENTORY_PRICING = 'MISSING_INVENTORY_PRICING';

const DuplicateAppointmentMessage = {
  line1: trans('DUPLICATE_APPOINTMENT_ERROR_LINE_1', 'An appointment was already created to tour this unit at this time.'),
  line2: trans('DUPLICATE_APPOINTMENT_ERROR_LINE_2', 'A confirmation was sent to your email.'),
};

const SlotUnavailableMessage = {
  line1: trans('SLOT_UNAVAILABLE_ERROR_LINE_1', 'The selected appointment time slot is no longer available.'),
  line2: trans('SLOT_UNAVAILABLE_ERROR_LINE_2', 'Please go back to the previous step and select a new time that works for you.'),
};

const MissingInventoryPricingMessage = {
  line1: trans(
    'MISSING_INVENTORY_PRICING_ERROR_LINE1',
    'Our availability changes frequently and this unit is no longer available. Please go back to the property page and select a different unit.',
  ),
};

const GenericErrorMessage = {
  line1: trans('GENERIC_ERROR', 'Error saving appointment.'),
};

export default class AppointmentCreateModel {
  @observable
  selectedAppointmentDateTime;

  @observable
  wizardIndex = WIZARD_DATETIME_SELECTOR_INDEX;

  @observable.shallow
  _sentAppointments = [];

  @computed
  get webSiteStore() {
    return this._webSiteStore;
  }

  @computed
  get showDuplicateApptError() {
    const { contactFormModel, getRequestData } = this;
    const formData = contactFormModel?.serializedData;

    const currentRequest = getRequestData(formData);
    return this._sentAppointments.find(sa => isEqual(sa, currentRequest));
  }

  @action
  setDynamicFields(dynamicFields) {
    this.dynamicFields = dynamicFields;
    this.contactFormModel = new AppointmentFormModel(this.dynamicFields, this.webSiteStore);
  }

  constructor({ service, selfServeModel, webSiteStore } = {}, { dynamicFields } = {}) {
    this._webSiteStore = webSiteStore;
    this.setDynamicFields(dynamicFields);

    this.saveAppointmentRq = Request.create({
      call: ({ mobilePhone: phone, ...rest }) => {
        // we receive mobilePhone from the form but the api expects phone
        // this used to be done at the service layer, but it makes more sense
        // to move this logic to the stores as we fire from here the other events
        // like onAppointmentCreated when defined
        let ret = { ...rest, phone };
        const { onAppointmentSave } = this;
        ret = onAppointmentSave ? onAppointmentSave(ret) : ret;
        return service.saveAppointment({
          ...ret,
          campaignEmail: selfServeModel.campaignEmail,
          marketingSessionId: selfServeModel.marketingSessionId,
          propertyId: this._webSiteStore?.currentPropertyId,
        });
      },
    });
  }

  @computed
  get savingAppointment() {
    return this.saveAppointmentRq.loading;
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

  @action
  moveNext = () => {
    this.wizardIndex++;
    if (this.wizardIndex > WIZARD_THANK_YOU_INDEX) {
      this.wizardIndex = WIZARD_THANK_YOU_INDEX;
    }
  };

  @action
  movePrev = formData => {
    this.wizardIndex--;
    this.syncWithWebSiteStore(formData);

    if (this.wizardIndex < WIZARD_DATETIME_SELECTOR_INDEX) {
      this.wizardIndex = WIZARD_DATETIME_SELECTOR_INDEX;
    }
  };

  @action
  moveToBeginning = () => {
    this.wizardIndex = WIZARD_DATETIME_SELECTOR_INDEX;
  };

  @computed
  get appointmentDateFormatted() {
    const { selectedAppointmentDateTime } = this;
    if (!selectedAppointmentDateTime) return '';

    return selectedAppointmentDateTime.format(trans('DEFAULT_APPOINTMENT_FORMAT', 'MMMM DD, YYYY [at] h:mm a'));
  }

  @action
  selectAppointmentDateTime = dateTime => {
    this.selectedAppointmentDateTime = dateTime;
    this.saveAppointmentRq.clearError();
    this.moveNext();
  };

  @action
  syncWithWebSiteStore(formData) {
    const { webSiteStore } = this;
    if (!webSiteStore) return;

    const { name, mobilePhone: phone, email, moveInTime } = formData;
    webSiteStore.setFullName(name);
    webSiteStore.setPhoneNo(phone);
    webSiteStore.setEmail(email);
    webSiteStore.setMoveInTime(moveInTime);
  }

  getRequestData = formData => {
    const { selectedAppointmentDateTime } = this;
    return {
      ...formData,
      requestAppointment: {
        // Updated startDate. Need to handle where startDate can be passed in from client
        startDate: selectedAppointmentDateTime?.toJSON(),
        inventoryId: this.layoutStore?.selectedInventoryId,
      },
      qualificationQuestions: {
        moveInTime: formData.moveInTime,
        numBedrooms: this.convertNumBedrooms(this.numBedrooms),
        cashAvailable: 'UNKNOWN',
        groupProfile: 'NOT_YET_DETERMINED',
      },
    };
  };

  @action
  async saveAppointment(formData) {
    const { saveAppointmentRq, onAppointmentCreated } = this;
    this.syncWithWebSiteStore(formData);

    const requestData = this.getRequestData(formData);

    if (this._sentAppointments.find(sa => isEqual(sa, requestData))) {
      return false;
    }

    await saveAppointmentRq.execCall(requestData);

    if (saveAppointmentRq.success) {
      onAppointmentCreated && onAppointmentCreated(saveAppointmentRq.lastPayloadSent ? saveAppointmentRq.lastPayloadSent[0] : {});

      this.moveNext();

      runInAction(() => {
        this._sentAppointments.push(requestData);
      });
    }

    return saveAppointmentRq.success;
  }

  @computed
  get appointmentSavingError() {
    const {
      saveAppointmentRq: { error },
    } = this;

    return !!error || this.showDuplicateApptError;
  }

  @computed
  get appointmentSavingErrorMessage() {
    const {
      saveAppointmentRq: { error },
    } = this;

    if (error) {
      switch (error) {
        case DUPLICATE_APPOINTMENT_TOKEN:
          return DuplicateAppointmentMessage;
        case SLOT_UNAVAILABLE_TOKEN:
          return SlotUnavailableMessage;
        case MISSING_INVENTORY_PRICING:
          return MissingInventoryPricingMessage;
        default:
          return GenericErrorMessage;
      }
    }

    if (this.showDuplicateApptError) {
      return DuplicateAppointmentMessage;
    }

    return {};
  }
}
