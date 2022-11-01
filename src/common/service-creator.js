/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

import { fetch } from './fetcher';
import { retryOnFail } from './retry-on-fail';

export const combine = (host, path) => {
  host = host.replace(/\/$/, '');
  path = path.replace(/^\//, '');
  return `${host}/${path}`;
};

const getDefaultData = (args = []) => (args.length > 0 ? args[0] : undefined);

const tryCall = async (fn, ...args) => {
  try {
    return await fn(...args);
  } catch (err) {
    const fnName = fn ? fn.name : 'anonymous';
    console.warn(`[ERROR]: error trying to execute fn: "${fnName}".`, err);
    return undefined;
  }
};

export const createService = serviceDescriptor =>
  Object.keys(serviceDescriptor).reduce(
    (service, serviceName) => {
      let lastFetchArgs = {};
      async function serviceFn(...args) {
        // clear the args as soon as we enter the function to prevent use stale data
        lastFetchArgs = {};
        // eslint-disable-next-line prefer-const
        let { url, data, headers, ...callDescriptor } = serviceDescriptor[serviceName];

        url = typeof url === 'function' ? await tryCall(url, ...args) : url;
        // if data is a function we pass all the arguments to the function so it creates
        // the payload with all the provided arguments, expecting it to return a single object
        // if the data is not a function then we get the first argument passed to the function as the
        // data payload. If this is an object it will be serialized using json stringify before sending it
        data = typeof data === 'function' ? await tryCall(data, ...args) : getDefaultData(args);
        headers = typeof headers === 'function' ? await tryCall(headers, ...args) : headers;

        const { _headersFn } = this;

        headers = typeof _headersFn === 'function' ? await tryCall(_headersFn, { params: args, headers }) : headers;

        const opts = { ...callDescriptor, data, headers };

        lastFetchArgs = {
          url,
          opts,
        };

        return fetch(url, opts);
      }

      service[serviceName] = async function wrappedFn(...args) {
        const { _onRetry } = service;
        // by default we will attempt to execute an xhr call twice
        const { retryAttempt, maxAttempts = 2 } = serviceDescriptor[serviceName];

        const next = retryAttempt || _onRetry;

        if (next) {
          if (typeof next !== 'function') throw new Error('Retry function must be a function');
          // returning here is important to be able to pass the promise return value tp the caller
          return retryOnFail(() => serviceFn.apply(service, args), {
            maxAttempts,
            next: (error, attempt, opts) => next(error, attempt, { ...opts, lastFetchArgs }),
            fnName: serviceName,
          });
        }

        return serviceFn.apply(service, args);
      };

      return service;
    },
    {
      setHeaders(headers = {}) {
        this._headersFn = typeof headers !== 'function' ? () => headers : headers;
      },
    },
  );
