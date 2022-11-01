/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

import { phoneFormat } from '../simple-format';
describe('simple-format', () => {
  describe('by default', () => {
    it('should format a phone number with parenthesis', () => {
      const result = phoneFormat('4084809999');
      expect(result).toEqual('(408) 480-9999');
    });
  });

  describe('when style is dot', () => {
    it('should format a phone number with parenthesis', () => {
      const result = phoneFormat('4084809999', { style: 'dot' });
      expect(result).toEqual('408.480.9999');
    });
  });

  describe('when style is hyphen', () => {
    it('should format a phone number with parenthesis', () => {
      const result = phoneFormat('4084809999', { style: 'hyphen' });
      expect(result).toEqual('408-480-9999');
    });
  });

  describe('when number contains formatting', () => {
    it('should format a phone number with parenthesis', () => {
      const result = phoneFormat('408.480.9999');
      expect(result).toEqual('(408) 480-9999');
    });
  });
});
