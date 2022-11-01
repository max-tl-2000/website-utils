/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

import dispatcher from 'dispatchy';
import { appState } from '../Stores/AppState';
import { isValidEvent } from './tracking-helper';

const trackEventName = 'track:action';

export class Tracker {
  constructor({ webSiteStore }) {
    this.dispatcher = dispatcher.create();
    this.webSiteStore = webSiteStore;
  }

  addConsumer(fn) {
    const wrappedFn = (e, eventData) => {
      // function is async to catch also rejections
      // inside the tracking function
      setTimeout(async () => {
        try {
          fn && fn(eventData);
        } catch (err) {
          console.error('>> tracker error', err);
        }
      }, 0);
    };

    this.dispatcher.on(trackEventName, wrappedFn);
  }

  notify(event, payload) {
    if (!isValidEvent(event)) {
      if (process.env.NODE_ENV !== 'production') {
        const msg = 'invalid event name provided';
        console.warn(msg, event);
      }
    }

    this.dispatcher.fire(trackEventName, this.addContextToEventData(event, payload));
  }

  addContextToEventData(eventAction, payload = {}) {
    const { location } = window;
    const { href: currentUrl, pathname: pageContext } = location;
    const marketingSessionId = appState.session?.marketingSessionId;

    const consentToGDPR = appState.trackUserActivity;

    const { webSiteStore } = this;
    const property = webSiteStore?.currentPropertyStore?.property;
    const pName = property?.name;
    const propertyName = property?.displayName;
    const propertyId = property?.propertyId;

    return {
      eventAction,
      component: '',
      subContext: '',
      ...payload,
      property: {
        externalId: pName,
        name: propertyName,
        id: propertyId,
      },
      consentToGDPR,
      currentUrl,
      pageContext: pageContext === '/' ? 'home' : pageContext,
      marketingSessionId,
    };
  }
}
