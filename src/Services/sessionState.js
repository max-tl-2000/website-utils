/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

import { setInCache, getFromCache, removeFromCache } from '../common/lsCache';

const STORAGE_KEY = 'websiteSession';
const USER_ACTIVITY_STORAGE_KEY = 'trackUserActivity';

export const setTrackUserActivity = value => setInCache(USER_ACTIVITY_STORAGE_KEY, value);
export const getTrackUserActivity = () => getFromCache(USER_ACTIVITY_STORAGE_KEY, false);

export const getSessionState = () => getFromCache(STORAGE_KEY, {});
export const setSessionState = state => setInCache(STORAGE_KEY, state);
export const clearSessionState = () => removeFromCache(STORAGE_KEY);
