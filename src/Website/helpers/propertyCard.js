/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

const getMarketingLayoutGroupDisplayName = ({ shortDisplayName = '' }) => shortDisplayName;

export const formatLayoutGroups = ({ marketingLayoutGroups = [] }) => {
  if (!marketingLayoutGroups.length) return '';

  const firstLayoutGroupDisplayName = getMarketingLayoutGroupDisplayName(marketingLayoutGroups[0]);
  if (marketingLayoutGroups.length === 1) return firstLayoutGroupDisplayName;

  const lastLayoutgroupDisplayName = getMarketingLayoutGroupDisplayName(marketingLayoutGroups.slice(-1).pop());

  return `${firstLayoutGroupDisplayName} – ${lastLayoutgroupDisplayName}`;
};

export const formatStateAndCity = ({ state, city }) => [city, state].filter(x => x).join(', ');
