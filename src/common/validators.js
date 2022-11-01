/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

import { parsePhone } from './phone/phone-helper';
import { isValidEmail } from './email/emailHelper';
import { trans } from './trans';
import { toMoment, now } from './moment-utils';
import { isObject } from './type-of';

// if the field is required add the required validation
// Required is a flag, no need to add a required validator. just add the required: true or required: 'Error message when failed' when the value is considered missing.
export const validateValidEmail = ({ value }) => (value && !isValidEmail(value) ? { error: trans('INVALID_EMAIL', 'Enter a valid email') } : true);
export const validateValidPhone = ({ value }) => (value && !parsePhone(value).valid ? { error: trans('INVALID_PHONE', 'Enter a valid phone number') } : true);

export const validateValidDate = ({ value }) => {
  const date = toMoment(value, { parseFormat: 'YYYY-MM-DD' });
  if (!date.isValid()) {
    return { error: trans('INVALID_DATE', 'Please select a valid date') };
  }
  return true;
};

export const validateValidCommunity = ({ value }) => {
  if (!value || !isObject(value) || !Object.keys(value || {}).length) {
    return { error: trans('INVALID_COMMUNITY_REQUIRED', 'Community selection is required') };
  }

  const { propertyName, city, state } = value;
  if (!propertyName || !city || !state) {
    return { error: trans('INVALID_COMMUNITY_UNKNOWN', 'Please provide a valid community') };
  }

  return true;
};

export const validateDateIsFuture = ({ value }) => {
  const date = toMoment(value, { parseFormat: 'YYYY-MM-DD' });
  if (date.isBefore(now(), 'day')) {
    return { error: trans('DATE_CANNOT_BE_IN_THE_PAST', 'Date in the past is not allowed') };
  }
  return true;
};

export const validators = {
  VALID_EMAIL: validateValidEmail,
  VALID_PHONE: validateValidPhone,
  VALID_DATE: validateValidDate,
  VALID_COMMUNITY: validateValidCommunity,
  IS_FUTURE_DATE: validateDateIsFuture,
};

export const combineValidators = (fns = []) => async (...args) => {
  let retVal = true; // we assume true
  for (let i = 0; i < fns.length; i++) {
    const fn = fns[i];
    retVal = await fn(...args);

    if (retVal === true) {
      continue; // eslint-disable-line no-continue
    }
    break;
  }
  return retVal;
};

export const getFnFromValidator = validator => {
  if (typeof validator === 'function') return validator;
  const fn = validators[validator];

  if (!fn) {
    throw new Error(`Cannot find validator function for ${validator}`);
  }

  return fn;
};
