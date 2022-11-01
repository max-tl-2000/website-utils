/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

export const formatNumber = val => {
  if (typeof val !== 'number') val = 0;

  const parts = val.toString().split('.');
  const integerPart = parts[0];
  const decimalPart = parts[1];

  return `${integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}${decimalPart ? `.${decimalPart}` : ''}`;
};

export const formatCurrency = (amount, symbol = '$') => `${symbol}${formatNumber(amount)}`;
