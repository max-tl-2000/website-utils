/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

import { retryOnFail } from '../retry-on-fail';

describe('retryOnFail', () => {
  it('should execute a function until it pass without throwing', async () => {
    const testFn = jest.fn(count => {
      if (count !== 0) throw new Error('count is not 0');
    });

    let initialValue = 3;
    const next = jest.fn((error, attempt) => {
      attempt();
    });

    await retryOnFail(() => testFn(--initialValue), { maxAttempts: 5, next, fnName: 'testFn' });

    expect(initialValue).toEqual(0);
    expect(testFn).toHaveBeenCalledTimes(3);
    expect(next).toHaveBeenCalledTimes(2);
  });

  describe('when the function keeps failing more times than the maxAttempts setting', () => {
    it('should throw with the last error', async () => {
      const testFn = jest.fn(count => {
        if (count !== 0) throw new Error('count is not 0');
      });

      let initialValue = 5;
      const next = jest.fn((error, attempt) => attempt()); // return is super important!! without returning here rejections WILL be swallowed

      try {
        await retryOnFail(() => testFn(--initialValue), { maxAttempts: 2, next, fnName: 'testFn' });
        expect(false).toEqual(true); // this should never happen
      } catch (err) {
        expect(err.message).toEqual('count is not 0');
      }

      expect(initialValue).toEqual(3);
    });
  });
});
