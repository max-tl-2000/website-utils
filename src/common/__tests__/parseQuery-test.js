/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

import { parseQuery } from '../parseQuery';

describe('parseQuery', () => {
  describe('when an query string is passed', () => {
    it('should parse the query string if the query string has a ? character or not', () => {
      expect(parseQuery('?abc=a')).toEqual(parseQuery('abc=a'));
    });

    it('should parse the query string triming the query', () => {
      expect(parseQuery('?abc=a  ')).toEqual(parseQuery('abc=a'));
    });

    it('should parse the query string decoding it', () => {
      expect(parseQuery('arr[]=Bike friendly&arr[]=baz&arr[]=boo&bar=bar')).toEqual(parseQuery('arr[]=Bike%20friendly&arr[]=baz&arr[]=boo&bar=bar'));
      expect(parseQuery('arr[]=Bike friendly&arr[]=baz&arr[]=boo&bar=bar')).toEqual({ arr: ['Bike friendly', 'baz', 'boo'], bar: 'bar' });
    });
  });
});
