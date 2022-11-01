/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

import { getSessionState, getTrackUserActivity, setSessionState, setTrackUserActivity, clearSessionState } from '../../Services/sessionState';
import nullish from '../../common/nullish';

let sessionState;
let trackUserActivity;

export const appState = {
  get session() {
    if (nullish(sessionState)) {
      sessionState = getSessionState();
    }
    return sessionState;
  },

  set session(value) {
    sessionState = value;
    setSessionState(value);
  },

  clearSession() {
    sessionState = undefined;
    clearSessionState();
  },

  get trackUserActivity() {
    if (nullish(trackUserActivity)) {
      trackUserActivity = getTrackUserActivity();
    }
    return trackUserActivity;
  },

  set trackUserActivity(value) {
    if (trackUserActivity !== value) {
      trackUserActivity = value;
      setTrackUserActivity(value);
    }
  },
};
