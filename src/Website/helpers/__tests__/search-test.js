/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

import { findMatchingSearch } from '../search';

import { MARKETING_SEARCH } from './fixtures/search-data';

describe('findMatchingSearch', () => {
  describe('When the inactive flag is true for a matching marketing search', () => {
    it('it should skip that one and return the next matching result', () => {
      const query = { region: 'Topeka' };
      const scope = 'region';
      const result = findMatchingSearch(MARKETING_SEARCH, query, scope);
      const expected = {
        order: 45,
        entryMatch: '*',
        scope: 'region',
        url: '/communities',
        queryStringFlag: true,
        inactiveFlag: false,
      };
      expect(result).toEqual(expected);
    });
  });

  describe('When the search query match the scope and entryMatch', () => {
    it('it should return that matching result', () => {
      const query = { region: 'Denver' };
      const scope = 'region';
      const result = findMatchingSearch(MARKETING_SEARCH, query, scope);
      const expected = {
        order: 1,
        entryMatch: 'Denver',
        scope: 'region',
        url: '/communities/region/denver',
        queryStringFlag: false,
        inactiveFlag: false,
      };
      expect(result).toEqual(expected);
    });
  });

  describe('When the scope on marketing search value is all', () => {
    it('it should match any query scope', () => {
      const query = { city: 'Brooklyn' };
      const scope = 'city';
      const result = findMatchingSearch(MARKETING_SEARCH, query, scope);
      const expected = {
        order: 47,
        entryMatch: '*',
        scope: 'all',
        url: '/communities',
        queryStringFlag: true,
        inactiveFlag: false,
      };
      expect(result).toEqual(expected);
    });
  });

  describe('When the entryMatch is "*" ', () => {
    it('it should match any query with any search value for the specific scope', () => {
      const query = { state: 'California' };
      const scope = 'state';
      const result = findMatchingSearch(MARKETING_SEARCH, query, scope);
      const expected = {
        order: 43,
        entryMatch: '*',
        scope: 'state',
        url: '/communities',
        queryStringFlag: true,
        inactiveFlag: false,
      };
      expect(result).toEqual(expected);
    });
  });

  describe('When the query match a marketing search but then there is another one with prior "order"', () => {
    it('it should return the one with prior order', () => {
      const query = { region: 'Sioux City' };
      const scope = 'region';
      const result = findMatchingSearch(MARKETING_SEARCH, query, scope);
      const expected = {
        order: 0,
        entryMatch: 'Sioux City',
        scope: 'region',
        url: '/communities',
        queryStringFlag: true,
        inactiveFlag: false,
      };
      expect(result).toEqual(expected);
    });
  });

  describe('When the query is for a neighborhood and there is a "stateScope" and "cityscope" match', () => {
    it('it should return the result for that match.', () => {
      const query = { neighborhood: 'Cherry Hills', state: 'CA', city: 'Pleasentville' };
      const scope = 'neighborhood';
      const result = findMatchingSearch(MARKETING_SEARCH, query, scope);
      const expected = {
        order: 7,
        entryMatch: 'Cherry Hills',
        scope: 'neighborhood',
        url: '/communities/neighborhood/ca/pleasentville/cherryhills',
        stateScope: 'CA',
        cityScope: 'Pleasentville',
        queryStringFlag: false,
        inactiveFlag: false,
      };
      expect(result).toEqual(expected);
    });
  });

  describe('When the query is for a city and there is a "stateScope"', () => {
    it('it should return the result for that match.', () => {
      const query = { city: 'Pleasentville', state: 'PA' };
      const scope = 'city';
      const result = findMatchingSearch(MARKETING_SEARCH, query, scope);
      const expected = {
        order: 5,
        entryMatch: 'Pleasentville',
        scope: 'city',
        url: '/communities/city/pa/pleasentville',
        stateScope: 'PA',
        queryStringFlag: false,
        inactiveFlag: false,
      };
      expect(result).toEqual(expected);
    });
  });
});
