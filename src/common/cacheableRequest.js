/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

import trim from 'jq-trim';
import Request from './request';
import { deferred } from './deferred';
import { getFromCache, setInCache, removeFromCache } from './lsCache';
import { now, toMoment } from './moment-utils';
import nullish from './nullish';

export const createCacheableRequest = args => {
  const { getId, hasExpiredFn, onBeforeCacheEntrySave, disabled, cacheTimeout, cachePrefix, ...rest } = args;
  const rq = new Request(rest);

  if (disabled) return rq;

  const dataHasExpired = async (entry, params) => {
    let cacheIsInValid;

    if (!nullish(cacheTimeout)) {
      const { ts } = entry;

      if (!ts) {
        throw new Error('cannot determine if cached data has expired. Missing ts property');
      }

      const timestamp = toMoment(ts);
      const nowTs = now();
      cacheIsInValid = nowTs.diff(timestamp) > cacheTimeout;
    }

    if (cacheIsInValid) {
      return true;
    }

    if (typeof hasExpiredFn === 'function') {
      return await hasExpiredFn(entry, params);
    }

    return true;
  };

  if (!getId) {
    throw new Error('Cacheable requests need a function to determine the id to use as cacheKey');
  }

  rq.doCall = async (fn, params) => {
    const deferredInstance = deferred();
    const id = await getId(params);
    if (!id) throw new Error('an id is required to identify cacheable requests and getId function returned none');
    const key = `${trim(cachePrefix)}_${id}`;

    let entry = getFromCache(key);

    if (entry) {
      const expired = await dataHasExpired(entry, params);
      const { response } = entry;

      if (!expired) {
        deferredInstance.resolve(response);
        return deferredInstance;
      }
      removeFromCache(key);
    }

    const p = fn(params);

    if (!p || !p.then || !p.catch) throw new Error('Cacheable "call" function must return a promise');

    p.then(async _response => {
      const _ts = now().toJSON();
      entry = { ts: _ts, response: _response };

      if (onBeforeCacheEntrySave) {
        await onBeforeCacheEntrySave(entry);
      }

      setInCache(key, entry);
      deferredInstance.resolve(_response);
    });

    p.catch(deferredInstance.reject);

    return deferredInstance;
  };

  return rq;
};
