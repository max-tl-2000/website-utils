/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

export const isValidEmail = email => {
  const EMAIL_REGEX_VALIDATOR = /^[-!#$%&'*+/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-?\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;
  // inspired by https://github.com/Sembiance/email-validator. MIT license
  // inlining it here to make it easier to port back from prod_master to master

  if (!email) return false;

  if (email.length > 254) return false;

  const valid = EMAIL_REGEX_VALIDATOR.test(email);

  if (!valid) return false;

  // Further checking of some things regex can't handle
  const parts = email.split('@');
  if (parts[0].length > 64) return false;

  const domainParts = parts[1].split('.');
  if (domainParts.some(part => part.length > 63)) return false;

  return true;
};
