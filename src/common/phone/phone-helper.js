/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

import trim from 'jq-trim';
import { parse, format, isValidNumber } from './libphone';
import { phoneFormat } from './simple-format';

const normalizePrefix = (phoneNumber, countryCode = '1') => {
  phoneNumber = trim(phoneNumber);

  let res;

  if (phoneNumber.match(/^\+/)) {
    res = phoneNumber;
  } else if (phoneNumber.startsWith('00')) {
    res = `+${phoneNumber.slice(2)}`;
  } else {
    res = `+${countryCode}${phoneNumber}`;
  }

  return res.replace(/\*/g, '');
};

export const parsePhone = phoneNumber => {
  let number = normalizePrefix(phoneNumber, '1');

  let parsedPhone = parse(number);

  let valid = isValidNumber(parsedPhone);

  if (!valid) {
    // if failed maybe it already contained the country code
    // so we pass the prefix as empty. This seems to be a mistake, but
    // unit tests were considering this case so I will just follow suit
    number = normalizePrefix(phoneNumber, '');
    parsedPhone = parse(number);
    valid = isValidNumber(parsedPhone);
  }

  let international = '';
  let national = '';
  let normalized = '';

  if (valid) {
    international = format(parsedPhone, 'International');
    national = format(parsedPhone, 'National');
    normalized = format(parsedPhone, 'E.164');
  }

  return {
    country: (parsedPhone || {}).country,
    valid,
    international,
    national,
    normalized,
  };
};

export const isValidPhoneNumber = number => {
  const { valid } = parsePhone(number) || {};
  return valid;
};

export const formatPhoneNumber = number => {
  const { normalized } = parsePhone(number) || {};
  return normalized;
};

let defaultFormat = 'parentheses';

// TODO: find a way to remove implicit globals
// This approach is not the best because the defaultFormat is set into this module from the init
// call to init Reva Utils. Problem is that if someone else calls this method
// from any part of the code will alter the default behavior and callers might not be aware of this
// change. The best is to pass this values to the website store and always call these methods with
// parameters. We can refactor this into a helper for website-utils and put it on the websiteStore
// which will have access to the phoneFormat, that way the value is not stored in 2 places (settings and here)
// but on a single one and this module does not rely anymore on implicit globals
export const setDefaultFormat = theFormat => {
  defaultFormat = theFormat;
};

export const formatPhoneToDisplay = (number, { style = defaultFormat } = {}) => {
  const { country, international, national, valid } = parsePhone(number) || {};
  if (!valid) {
    return number; // if not valid just return the number itself
  }
  return country === 'US' ? phoneFormat(national, { style }) : international;
};

export const parseAPhone = number => {
  const { country, international, national, valid } = parsePhone(number) || {};

  return {
    number,
    country,
    international,
    national,
    valid,
    format({ style = defaultFormat } = {}) {
      if (!valid) return `${trim(number)}`;
      return country === 'US' ? phoneFormat(national, { style }) : international;
    },
  };
};
