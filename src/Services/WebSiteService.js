/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

import { createService, combine } from '../common/service-creator';
import nullish from '../common/nullish';
import { parseUrl } from '../common/parseUrl';
import { createEndpointsService } from './selfServeService';
import { appState } from '../Website/Stores/AppState';

let serviceInstances;
const serviceState = {};

export const getAuthToken = () => {
  const { authToken } = serviceState;
  if (!authToken) {
    throw new Error('authToken is not defined!. Please call initWebService with a token and apiHost before attempt to use it');
  }
  return authToken;
};

export const getApiHost = () => {
  const { apiHost } = serviceState;
  if (!apiHost) {
    throw new Error('apiHost is not defined!. Please call initWebService with a token and apiHost before attempt to use it');
  }

  return apiHost;
};

export const initWebService = ({ host, token } = {}) => {
  serviceState.authToken = token;
  serviceState.apiHost = host;
};

const createSessionService = (apiHost, token) => {
  const sessionService = createService({
    createSession: {
      method: 'POST',
      crossDomain: true,
      url: combine(apiHost, '/api/v1/marketing/session'),
    },
  });

  sessionService.setHeaders({
    Authorization: `Bearer ${token}`,
  });

  return sessionService;
};

const getMarketingSession = async (apiHost, token) => {
  const sessionService = createSessionService(apiHost, token);

  const { session } = appState;

  const referrerUrl = (parseUrl(document.referrer) || {}).origin;
  const currentUrl = window.location.href;
  const payload = { referrerUrl, currentUrl };

  const { marketingSessionId } = session;

  if (marketingSessionId) {
    payload.marketingSessionId = marketingSessionId;
  }

  const response = await sessionService.createSession(payload);

  const state = {
    marketingSessionId: response.marketingSessionId,
    phone: response.phone,
    email: response.email,
  };

  appState.session = state;
  return state;
};

const createWebSiteService = apiHost => {
  const service = createService({
    getPropertyInfo: {
      method: 'GET',
      crossDomain: true,
      url: ({ propertyId }) => combine(apiHost, `/api/v1/marketing/property/${propertyId}?includePOIs=true&includeAmenities=true`),
      headers: data => ({ 'x-reva-property-id': data?.propertyId }),
    },
    getRelatedProperties: {
      method: 'POST',
      crossDomain: true,
      url: ({ propertyId }) => combine(apiHost, `/api/v1/marketing/properties/${propertyId}/search`),
      headers: data => ({ 'x-reva-property-id': data?.propertyId }),
    },
    getProperties: {
      method: 'GET',
      crossDomain: true,
      url: () => combine(apiHost, '/api/v1/marketing/properties'),
    },
    search: {
      method: 'POST',
      crossDomain: true,
      url: () => combine(apiHost, '/api/v1/marketing/properties/search'),
      data: ({ query, marketingLayoutGroups, lifestyles, marketRent, ...rest }) => ({
        ...query,
        marketingLayoutGroups,
        marketRent: !nullish(marketRent) ? { max: marketRent } : undefined,
        lifestyles,
        ...rest,
      }),
    },
    getLayouts: {
      method: 'GET',
      dataAsQueryParams: true,
      crossDomain: true,
      url: ({ propertyId, marketingLayoutGroupId }) =>
        combine(apiHost, `/api/v1/marketing/properties/${propertyId}/layoutGroup/${marketingLayoutGroupId}/layouts`),
      headers: data => ({ 'x-reva-property-id': data?.propertyId }),
    },
    getInventory: {
      method: 'GET',
      crossDomain: true,
      url: ({ inventoryId }) => combine(apiHost, `/api/v1/marketing/inventory/${inventoryId}`),
      headers: data => ({ 'x-reva-property-id': data?.propertyId }),
    },
    getInventoryPricing: {
      method: 'GET',
      dataAsQueryParams: true,
      crossDomain: true,
      url: ({ inventoryId }) => combine(apiHost, `/api/v1/marketing/inventory/${inventoryId}/pricing`),
      data: ({ moveInDate }) => {
        if (!moveInDate) throw new Error('`moveInDate` parameter is required');
        return { moveInDate };
      },
      headers: data => ({ 'x-reva-property-id': data?.propertyId }),
    },
    getMarketingQuestions: {
      method: 'GET',
      crossDomain: true,
      url: ({ inventoryId }) => combine(apiHost, `/api/v1/marketing/inventory/${inventoryId}/quoteQuestions`),
      headers: data => ({ 'x-reva-property-id': data?.propertyId }),
    },
    submitGenericForm: {
      method: 'POST',
      crossDomain: true,
      url: () => combine(apiHost, '/api/v1/marketing/forms'),
    },
    sendContactUsInfo: {
      method: 'POST',
      url: combine(apiHost, '/api/v1/marketing/guestCard'),
      headers: data => ({ 'x-reva-property-id': data?.propertyId }),
    },
  });

  return service;
};

/**
 * the session state is an object that have the promise returned from the call to
 * get the marketingSession. Once that promise is resolved it will contain the marketing
 * session and all subsequent calls can use it to set the x-marketing-session-id header
 * @param {string} apiHost the api host endpoint
 * @param {string} token the token to authorize the calls
 * @return the session state oject
 */
const createSessionState = (apiHost, token) => ({
  _promise: null,
  /**
   * returns the promise from the call to `getMarketingSession`. If a previous promise exists
   * it will return that promise instead.
   */
  get promise() {
    if (!this._promise) {
      this._promise = getMarketingSession(apiHost, token);
    }
    return this._promise;
  },
  /**
   * clear the session state removing also the info from the localStorage
   */
  clear() {
    this._promise = null;
    appState.clearSession();
  },
});

let sessionState;

const initializeServices = () => {
  if (!serviceInstances) {
    const apiHost = getApiHost();
    const token = getAuthToken();

    sessionState = createSessionState(apiHost, token);

    serviceInstances = {
      webSiteService: createWebSiteService(apiHost),
      selfServeService: createEndpointsService(apiHost, sessionState),
    };

    Object.keys(serviceInstances).forEach(serviceName => {
      const service = serviceInstances[serviceName];

      service._apiHost = apiHost;

      service._onRetry = async (xhrError = {}, next, { attemptNo, fnName, lastFetchArgs = {} } = {}) => {
        console.warn(`>>> [RETRY]: attempt "${attemptNo}" to call "${fnName}"`);

        const errToken = xhrError?.response?.token;
        console.warn('>>> [ERROR]:', errToken);

        if (errToken === 'PROGRAM_NOT_FOUND') {
          const headers = lastFetchArgs?.opts?.headers || {};
          const marketingSessionIdInFetch = headers['x-reva-marketing-session-id'];
          const { marketingSessionId } = await sessionState.promise;

          const isSessionIdTheSameThatFailed = marketingSessionId && marketingSessionId === marketingSessionIdInFetch;

          if (isSessionIdTheSameThatFailed) {
            console.warn('>>> Clearing the session state as it produced a `PROGRAM_NOT_FOUND` error');
            sessionState.clear();
          }
        }
        // return is important otherwise promise rejection will be swallowed
        return next();
      };

      service.setHeaders(async ({ headers = {} }) => {
        const { marketingSessionId } = await sessionState.promise;
        const { programEmail } = serviceState;

        const outHeaders = {
          ...headers,
          Authorization: `Bearer ${token}`,
        };

        if (marketingSessionId) {
          outHeaders['x-reva-marketing-session-id'] = marketingSessionId;
        }
        if (programEmail) {
          outHeaders['x-reva-program-email'] = programEmail;
        }

        return outHeaders;
      });

      // this is adding a function to all services to get the marketingSession
      service.getMarketingSession = () => sessionState.promise;
    });
  }
  return serviceInstances;
};

export const getWebSiteService = () => {
  const services = initializeServices();
  return services.webSiteService;
};

export const getSelfServeService = () => {
  const services = initializeServices();
  return services.selfServeService;
};
