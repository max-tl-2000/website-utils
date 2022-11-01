/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

import moment from 'moment';
import { createService } from '../common/service-creator';
import { Events, FormStrings } from '../Website/helpers/chatConstants';
import { getApiHost, getAuthToken } from './WebSiteService';
import { now } from '../common/moment-utils';
import { Categories, Components, SubContexts } from '../Website/helpers/tracking-helper';

// Handle component check
const activeComponents = ['textBox', 'bullet', 'calendar', 'carousel', 'inventoryPicker', 'leaseTermMatrix'];
const DEFAULT_STEP = 'WestEggHome';
const DEFAULT_RULE = 'WestEgg';
const DEFAULT_SELECTED_TERMS = '6,12'; // TODO, we need way to pull this value in. Static for testing only.
const LOCAL_STORAGE_NAME = 'reva_chat_fullName';

let storedWorkflowName = null;

const buildChatPayload = (store, step, propertyStoreRqContent) => {
  let response = {};

  const chatLocalStorage = window.localStorage;
  const chatFullName = chatLocalStorage.getItem(LOCAL_STORAGE_NAME) || '';

  if (!step || step === DEFAULT_STEP) {
    response = {
      rule: DEFAULT_RULE,
      selectedTerms: null,
      workflowName: '',
      fullName: chatFullName,
      currentProperty: null,
      currentStep: '',
      email: null,
      phone: null,
      currentStepNumber: 1,
      step: {
        totalSteps: null,
        nextStep: '',
        stepNumber: null,
      },
    };
  } else {
    storedWorkflowName = step.workflow || storedWorkflowName;
    response = {
      rule: DEFAULT_RULE,
      selectedTerms: DEFAULT_SELECTED_TERMS,
      fullName: store.user.fullName || chatFullName,
      workflowName: storedWorkflowName,
      currentStep: step && (step.nextStep || step.workflow) ? step.nextStep : step,
      currentProperty: store.propertyName,
      currentStepNumber: 1,
      phone: store.user.phone || null,
      selectedMoveInDate: store.user.selectedMoveInDate || null,
      selectedInventory: store.selectedInventory || null,
      selectedMarketingLayoutLowestRent: store.user.selectedMarketingLayoutLowestRent || null,
      selectedMarketingLayoutGroupBedCount: store.inventory.selectedMarketingLayoutGroupBedCount || null,
      inventoryAvailabilityDate: store.inventory.inventoryAvailabilityDate || null,
      selectedMarketingLayout: store.inventory.selectedMarketingLayout,
      selectedTourDateTime: store.user.selectedTourDateTime?.storedValue || null,
      step: {
        totalSteps: null,
        nextStep: '',
        stepNumber: null,
      },
      email: store.user.email,
      has3DTour: propertyStoreRqContent?.['3DUrls']?.length > 0,
      hasVideos: propertyStoreRqContent?.videoUrls?.length > 0,
      hasPhotos: propertyStoreRqContent?.images?.length > 0,
    };
  }
  return response;
};

const resetStoredInfo = store => store.resetStoredInfo();

// Future iterations, Corticon will need to provide a method in whic app will know to save the locallyStored value.
// For now, we assume that if no name is provided, default to localStorage
const getFullName = name => name || (window.localStorage.getItem(LOCAL_STORAGE_NAME) || '');

// TODO: COMMENT TO FIX:  why don't we move this argument logic into the function itself (as it seems to be used in different places), and just pass the store?
const saveAppointment = async (store, acm, propertyId) => {
  const response = await acm.saveAppointment({
    name: getFullName(store.user.fullName ? store.user.fullName : store.storedUserInfo.fullName),
    email: store.user.email,
    _name_: FormStrings.DEFAULT_USER,
    _userName_: '',
    moveInTime: acm._webSiteStore._moveInTime,
    mobilePhone: store.user.phone,
    requestAppointment: {
      startDate: acm.selectAppointmentDateTime(store.user?.selectedTourDateTime?.moment),
    },
    qualificationQuestions: {
      moveInTime: acm._webSiteStore._moveInTime,
      numBedrooms: [],
      cashAvailable: FormStrings.UNKNOWN,
      groupProfile: FormStrings.NOT_YET_DETERMINED,
    },
    propertyId,
  });

  // TODO: Not best method right now, but hardcoding assumed TRUE response as 202. Will adjust later.
  if (response) {
    return { httpStatusCode: 202 };
  }
  return response;
};

const handleSubmitContactUs = async (store, acm, propertyId) => {
  const host = getApiHost();
  const token = getAuthToken();
  const marketingSession = await acm._webSiteStore.getMarketingSession();

  const data = {
    name: getFullName(store.user.fullName ? store.user.fullName : store.storedUserInfo.fullName),
    email: store.user.email,
    phone: store.user.phone,
    _name_: FormStrings.DEFAULT_USER,
    _userName_: '',
    moveInDate: acm.selectAppointmentDateTime(store.user?.selectedMoveInDate?.moment),
    moveInTime: acm._webSiteStore._moveInTime,
    message: `Preferred contact method: ${store.user.preferredContact?.toLowerCase()}.\n\nMessage: ${store.user.chatMessage}`,
    preferredContact: store.user.preferredContact?.toLowerCase(),
    qualificationQuestions: {
      moveInTime: acm._webSiteStore._moveInTime,
    },
    propertyId,
  };

  // Will look to take better advantage of the existing service to avoid fetch in next release
  const response = await fetch(`${host}/api/v1/marketing/guestCard`, {
    method: 'POST',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      'x-reva-marketing-session-id': marketingSession.marketingSessionId,
      'x-reva-property-id': propertyId,
    },
    referrerPolicy: 'origin',
    body: JSON.stringify(data),
  });
  return response.json();
};

const generateAndSendQuote = async (store, acm, propertyId) => {
  const host = getApiHost();
  const token = getAuthToken();
  const marketingSession = await acm._webSiteStore.getMarketingSession();

  const formatTimeRange = () => {
    const today = now().startOf('day');
    const selectedMoveIn = moment(store.user.selectedMoveInDate);
    const numberOfWeeks = selectedMoveIn.diff(today, 'week');
    if (numberOfWeeks <= 4) return 'NEXT_4_WEEKS';
    if (numberOfWeeks <= 8) return 'NEXT_2_MONTHS';
    if (numberOfWeeks <= 16) return 'NEXT_4_MONTHS';
    return 'BEYOND_4_MONTHS';
  };

  const formatBedCount = count => {
    let bedString = '';
    switch (count) {
      case 0:
        bedString = 'STUDIO';
        break;
      case 1:
        bedString = 'ONE_BED';
        break;
      case 2:
        bedString = 'TWO_BEDS';
        break;
      case 3:
        bedString = 'THREE_BEDS';
        break;
      case 4:
        bedString = 'FOUR_PLUS_BEDS';
        break;
      default:
        bedString = 'UNKNOWN';
    }
    return bedString;
  };

  const data = {
    email: store.user.email,
    name: getFullName(store.user.fullName ? store.user.fullName : store.storedUserInfo.fullName),
    phone: store.user.phone,
    _name_: FormStrings.DEFAULT_USER,
    _userName_: '',
    propertyId,
    qualificationQuestions: {
      cashAvailable: 'UNKNOWN', // Required but not handled during submission
      groupProfile: 'NOT_YET_DETERMINED', // Required but not handled during submission
      moveInTime: formatTimeRange(),
      numBedrooms: [formatBedCount(store.inventory.selectedMarketingLayoutGroupBedCount)],
    },
    requestQuote: {
      marketingQuestionsResponses: [],
      moveInDate: store.inventory.formatteMoveInDate,
      petCount: 0,
      termLength: [store.inventory.termLength],
      unitQualifiedName: store.inventory.unitQualifiedName,
    },
    unitId: store.inventory.unitId,
  };

  // Will look to take better advantage of the existing service to avoid fetch in next release
  const response = await fetch(`${host}/api/v1/marketing/guestCard`, {
    method: 'POST',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      'x-reva-marketing-session-id': marketingSession.marketingSessionId,
      'x-reva-property-id': propertyId,
    },
    referrerPolicy: 'origin',
    body: JSON.stringify(data),
  });
  return response.json();
};

const handleChatTrackingEvent = (acm, eventType, { ...rest }) => {
  acm[eventType](rest.eventActionLabel, {
    eventLabel: rest.eventLabel || `name-${rest.propertyName}`,
    chatbot: rest.returnChatBotTrackerObject,
    category: rest.category || Categories.NAVIGATION_WEBCHAT,
    component: rest.component || Components.NAVIGATION,
    subContexts: SubContexts.WEBCHAT,
  });
};

const handleSubmitAction = async (store, action, acm, propertyId) => {
  const eventActionLabel = 'webInquiry';
  const eventType = 'notifyEvent';
  let actionLabel = '';
  let componentType;
  let response;
  switch (action) {
    case Events.GENERATE_SEND_QUOTE:
      actionLabel = 'quote';
      componentType = Components.GENERATE_QUOTE;
      response = await generateAndSendQuote(store, acm, propertyId);
      break;
    case Events.SAVE_APPOINTMENT:
      actionLabel = 'appointment';
      componentType = Components.APPOINTMENT_CREATE;
      response = await saveAppointment(store, acm, propertyId);
      break;
    case Events.GUEST_SAVE_FORM:
      actionLabel = 'contact';
      componentType = Components.CONTACT_US;
      response = await handleSubmitContactUs(store, acm, propertyId);
      break;
    default:
      response = null;
  }
  // Need to set response here to validate 200 aand 202. With error we need to better handle the response
  resetStoredInfo(store);
  handleChatTrackingEvent(acm._webSiteStore, eventType, {
    eventActionLabel,
    propertyName: store.propertyName,
    returnChatBotTrackerObject: {},
    category: Categories.USER_ACTION_WEBCHAT,
    component: componentType,
    eventLabel: actionLabel,
  });
  return response;
};

const formatResponseWithComponents = (response, step, workflow) => {
  const buildObj = {
    components: [],
    currentStep: step,
    workflowName: workflow,
  };

  Object.entries(response).forEach(([key, value]) => {
    activeComponents.map(comp => {
      if (comp === key) {
        buildObj.components.push({ [key]: value[0] });
      } else {
        buildObj[key] = value;
      }
      return comp;
    });
  });
  return buildObj;
};

const createChatGardenService = (extraData = {}) => {
  const host = getApiHost();
  const token = getAuthToken();
  const service = createService({
    retrieveNextStep: {
      method: 'POST',
      url: `${host}/api/v1/marketing/chatbot/conversation`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      data: ({ ...data }) => {
        const { ...rest } = extraData;
        const ret = {
          ...data,
          ...rest,
        };
        return ret;
      },
    },
  });
  return service;
};

export { buildChatPayload, createChatGardenService, formatResponseWithComponents, handleChatTrackingEvent, handleSubmitAction };
