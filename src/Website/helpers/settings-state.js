/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

import { lsGet, lsSave, lsClear, clearLocalStorage } from '../../common/ls';

const STORAGE_KEY = 'reva_web_settings';
const USER_ACTIVITY_STORAGE_KEY = 'reva_trackUserActivity';

export const getWebSettings = () => lsGet(STORAGE_KEY);
export const saveWebSettings = state => lsSave(STORAGE_KEY, state);
export const clearWebSettings = () => lsClear(STORAGE_KEY);

export const clearWebSettingsIfHostTokenOrVersionChanged = ({ host, token, version }) => {
  const paramsKeys = `${STORAGE_KEY}_parameter_props`;
  const storedParams = lsGet(paramsKeys);

  if (!storedParams) {
    lsSave(paramsKeys, { host, token, version });
    return;
  }

  if (storedParams.host !== host || token !== storedParams.token || storedParams.version !== version) {
    const trackUserActivityFlag = lsGet(USER_ACTIVITY_STORAGE_KEY);

    clearLocalStorage();

    if (trackUserActivityFlag) {
      lsSave(USER_ACTIVITY_STORAGE_KEY, trackUserActivityFlag);
    }
    lsSave(paramsKeys, { host, token, version });
  }
};
