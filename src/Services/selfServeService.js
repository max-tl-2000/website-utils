/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

import { now } from '../common/moment-utils';
import { createService, combine } from '../common/service-creator';

export const createEndpointsService = (apiHost, sessionState) => {
  const service = createService({
    getAppointment: {
      method: 'GET',
      url: ({ token }) => combine(apiHost, `/api/v1/marketing/appointment/${token}`),
    },
    updateAppointment: {
      method: 'PATCH',
      url: ({ token }) => combine(apiHost, `/api/v1/marketing/appointment/${token}`),
      data: ({ ...rest }) => ({ ...rest, actionType: 'Update' }),
    },
    cancelAppointment: {
      method: 'PATCH',
      url: ({ token }) => combine(apiHost, `/api/v1/marketing/appointment/${token}`),
      data: () => ({ actionType: 'Cancel' }),
    },
    getSlots: {
      method: 'GET',
      dataAsQueryParams: true,
      url: combine(apiHost, '/api/v1/marketing/appointment/availableSlots'),
      headers: data => ({ 'x-reva-property-id': data?.propertyId }),
      data: async ({ from, noOfDays, campaignEmail: cEmail, marketingSessionId: sessionId }) => {
        const ret = {
          from: (from || now()).toJSON(),
          noOfDays,
        };
        if (sessionState && sessionState.promise) {
          const { marketingSessionId } = await sessionState.promise;
          ret.marketingSessionId = marketingSessionId;
          return ret;
        }

        const campaignEmail = sessionId ? undefined : cEmail;
        const marketingSessionId = sessionId;

        if (marketingSessionId) {
          ret.marketingSessionId = marketingSessionId;
        } else if (campaignEmail) {
          ret.campaignEmail = campaignEmail;
        }

        return ret;
      },
    },
    // TODO: unify this, guestCard and saveForm service methods
    saveAppointment: {
      method: 'POST',
      url: combine(apiHost, '/api/v1/marketing/guestCard'),
      headers: data => ({ 'x-reva-property-id': data?.propertyId }),
    },
    saveFeedback: {
      method: 'PATCH',
      url: ({ token }) => combine(apiHost, `/api/v1/marketing/appointment/${token}`),
      data: ({ feedback }) => ({ actionType: 'Update', feedback }),
    },
    guestCard: {
      method: 'POST',
      crossDomain: true,
      url: () => combine(apiHost, '/api/v1/marketing/guestCard'),
      headers: data => ({ 'x-reva-property-id': data?.propertyId }),
    },
  });

  return service;
};
