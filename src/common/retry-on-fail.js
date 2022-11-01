/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

/**
 * Retry a function until it passes without throwing
 *
 * @param {function} func
 * @param {object} options
 * @param {string} [options.fnName=annonymous] the name of the function that we will try
 * to execute until no exception is rised
 * @param {function} options.next the callback that will be invoked on error,
 * this is to give the caller an oportunity to change something (like removing
 * somethig from localstorage) before the next attempt
 * @param {number} [maxAttempts=2] the number of times the `func` will be be retried. default to 2
 */
export const retryOnFail = (func, { maxAttempts = 2, next, fnName = 'annonymous' } = {}) => {
  if (typeof func !== 'function') throw new Error('Parameter `func` has to be a function');
  if (typeof next !== 'function') throw new Error('Parameter `next` has to be a function');

  const decorated = async () => {
    let attemptNo = 0;
    let prevError;

    const attempt = async () => {
      attemptNo++;
      if (attemptNo > maxAttempts) {
        const msg = `Max number of attemps reached: ${maxAttempts} on "${fnName}" fn`;
        console.warn(msg);
        throw prevError || new Error(msg);
      }
      try {
        return await func();
      } catch (error) {
        prevError = error;
        return await next(error, attempt, { attemptNo, fnName });
      }
    };

    return attempt();
  };

  return decorated();
};
