/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

export const MARKETING_SEARCH = [
  {
    order: 1,
    entryMatch: 'Denver',
    scope: 'region',
    url: '/communities/region/denver',
    queryStringFlag: false,
    inactiveFlag: false,
  },
  {
    order: 2,
    entryMatch: 'Sioux City',
    scope: 'region',
    url: '/communities/region/sioux-city',
    queryStringFlag: false,
    inactiveFlag: false,
  },
  {
    order: 3,
    entryMatch: 'Topeka',
    scope: 'region',
    url: '/communities/region/topeka',
    queryStringFlag: false,
    inactiveFlag: true,
  },
  {
    order: 0,
    entryMatch: 'Sioux City',
    scope: 'region',
    url: '/communities',
    queryStringFlag: true,
    inactiveFlag: false,
  },
  {
    order: 4,
    entryMatch: 'Pleasentville',
    scope: 'city',
    url: '/communities/city/ca/pleasentville',
    stateScope: 'CA',
    queryStringFlag: false,
    inactiveFlag: false,
  },
  {
    order: 5,
    entryMatch: 'Pleasentville',
    scope: 'city',
    url: '/communities/city/pa/pleasentville',
    stateScope: 'PA',
    queryStringFlag: false,
    inactiveFlag: false,
  },
  {
    order: 6,
    entryMatch: 'Cherry Hills',
    scope: 'neighborhood',
    url: '/communities/neighborhood/pa/pleasentville/cherryhills',
    stateScope: 'PA',
    cityScope: 'Pleasentville',
    queryStringFlag: false,
    inactiveFlag: false,
  },
  {
    order: 7,
    entryMatch: 'Cherry Hills',
    scope: 'neighborhood',
    url: '/communities/neighborhood/ca/pleasentville/cherryhills',
    stateScope: 'CA',
    cityScope: 'Pleasentville',
    queryStringFlag: false,
    inactiveFlag: false,
  },
  {
    order: 43,
    entryMatch: '*',
    scope: 'state',
    url: '/communities',
    queryStringFlag: true,
    inactiveFlag: false,
  },
  {
    order: 44,
    entryMatch: '*',
    scope: 'neighborhood',
    url: '/communities',
    queryStringFlag: true,
    inactiveFlag: false,
  },
  {
    order: 45,
    entryMatch: '*',
    scope: 'region',
    url: '/communities',
    queryStringFlag: true,
    inactiveFlag: false,
  },
  {
    order: 47,
    entryMatch: '*',
    scope: 'all',
    url: '/communities',
    queryStringFlag: true,
    inactiveFlag: false,
  },
];
