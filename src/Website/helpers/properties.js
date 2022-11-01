/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

import { trans } from '../../common/trans';
import { asNumber } from '../../common/format';

export const hasSurfaceArea = ({ min = 0, max = 0 }) => min > 0 || max > 0;

export const formatSurfaceAreaRange = ({ min = 0, max = 0 }) => {
  if (!hasSurfaceArea({ min, max })) return '';

  if (min <= 0) {
    min = max >= 0 ? max : 0;
  }

  if (max <= 0) {
    max = min >= 0 ? min : 0;
  }

  const surfaceAreaRange = min !== max ? `${asNumber(min)} – ${asNumber(max)}` : asNumber(min);

  return `${surfaceAreaRange} ${trans('SQUARE_FEET', 'sq ft')}`;
};

export const hasItems = items => !!items?.length;

export const formatNumOfItems = items => {
  if (!hasItems(items)) return '';

  const sortedItems = items?.filter(it => it || it === 0).sort();

  const min = sortedItems[0];
  const max = sortedItems[items.length - 1];

  return min !== max ? `${min} - ${max}` : `${min}`;
};

export const prefixEachKeyWithData = dataProps => {
  const keys = Object.keys(dataProps);

  return keys.reduce((acc, key) => {
    const newKey = `data-${key}`;
    acc[newKey] = dataProps[key];
    return acc;
  }, {});
};
