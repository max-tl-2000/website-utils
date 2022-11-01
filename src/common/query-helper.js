/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

const queryFields = ['neighborhood', 'region', 'city', 'state'];
const filtersFields = ['marketingLayoutGroups', 'lifestyles', 'marketRent'];

const getLabelFrom = (query, fields) => {
  if (!query) return '';

  return fields
    .reduce((acc, f) => {
      const val = query[f];

      if (!val) return acc;
      acc.push(`${f}: ${val}`);
      return acc;
    }, [])
    .join(', ');
};

export const getLabelFromQuery = query => getLabelFrom(query, queryFields);

export const getLabelFromFilters = filters => getLabelFrom(filters, filtersFields);
