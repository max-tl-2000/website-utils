/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

import { win } from './globals';
import tryParse from './try-parse';

const { localStorage } = win;

export const lsSave = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error('lsSave error', err);
    console.error('key/value', key, value);
  }
};

export const lsGet = (key, defVal) => tryParse(localStorage.getItem(key), defVal);

export const lsClear = key => localStorage.removeItem(key);

export const clearLocalStorage = () => {
  try {
    localStorage.clear();
  } catch (err) {
    console.error('localStorage.clear error', err);
  }
};
