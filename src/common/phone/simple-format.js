/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

import trim from 'jq-trim';

export const phoneFormat = (input, { style } = {}) => {
  input = trim(input);
  input = input.replace(/\D/g, '');
  if (input.length > 10) {
    input = input.substr(1);
  }
  input = input.substring(0, 10);

  const size = input.length;

  if (!style || style === 'parentheses') {
    if (size < 4) {
      input = `(${input}`;
    } else if (size < 7) {
      input = `(${input.substring(0, 3)}) ${input.substring(3, 6)}`;
    } else {
      input = `(${input.substring(0, 3)}) ${input.substring(3, 6)}-${input.substring(6, 10)}`;
    }
  } else if (style === 'dot') {
    if (size < 7) {
      input = `${input.substring(0, 3)}.${input.substring(3, 6)}`;
    } else {
      input = `${input.substring(0, 3)}.${input.substring(3, 6)}.${input.substring(6, 10)}`;
    }
  } else if (style === 'hyphen') {
    if (size < 7) {
      input = `${input.substring(0, 3)}-${input.substring(3, 6)}`;
    } else {
      input = `${input.substring(0, 3)}-${input.substring(3, 6)}-${input.substring(6, 10)}`;
    }
  }

  return input;
};
