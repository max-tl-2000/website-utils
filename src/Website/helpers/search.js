/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

import nullish from '../../common/nullish';
import { parseQuery } from '../../common/parseQuery';

export const findMatchingSearch = (marketingSearch, query, scope) =>
  marketingSearch.reduce((acc, search) => {
    if (search.inactiveFlag) return acc;

    const hasValidScope = search.scope === scope || search.scope === 'all';

    const hasValidEntryMatch = search.entryMatch.toLowerCase() === (query[scope] || '').toLowerCase() || search.entryMatch === '*';

    if (!hasValidScope || !hasValidEntryMatch) return acc;

    const hasMinorOrder = nullish(acc.order) || search.order < acc.order;

    if (!search.stateScope && !search.cityScope && hasMinorOrder) {
      acc = search;
      return acc;
    }

    const matchStateAndCityScope = query.state === search.stateScope && query.city === search.cityScope;
    if (query.neighborhood && matchStateAndCityScope) acc = search;

    const matchStateScope = query.state === search.stateScope;
    if (query.city && matchStateScope) acc = search;

    return acc;
  }, {});

const getMatchingEntryByUrl = (marketingSearch, url) => marketingSearch.find(search => search.url === url) || {};

export const getSearchFilters = (location, marketingSearch) => {
  let queryParams = {};
  if (location.search || location.pathname === '/communities') {
    queryParams = parseQuery(window.location.search);
  }

  const [, searchParams = ''] = location.pathname.split('communities/');
  const splitedParams = searchParams.split('/');

  if (splitedParams.length === 2) {
    const { entryMatch, stateScope, cityScope } = getMatchingEntryByUrl(marketingSearch, location.pathname);
    const searchFilters = { [splitedParams[0]]: entryMatch, ...queryParams };

    if (stateScope) {
      searchFilters.state = stateScope;
    }

    if (cityScope) {
      searchFilters.city = cityScope;
    }

    return searchFilters;
  }

  return { ...queryParams };
};
