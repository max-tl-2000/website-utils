/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

import clsc from 'coalescy';

const cache = {};

const getValue = (rawKey = '', bindings = {}) => {
  const [, key] = rawKey.match(/\{\{(.*?)\}\}/) || [];
  return bindings[key] || '';
};

const parseBindings = (str = '', bindings = {}) => {
  const keys = str.match(/\{\{(.*?)\}\}/g) || [];

  return keys.reduce((acc, key) => {
    acc = acc.replace(key, getValue(key, bindings));
    return acc;
  }, str);
};

export const trans = (key, defaultValue, bindings = {}) => {
  const { translations = {} } = cache;
  return parseBindings(clsc(translations[key], defaultValue), bindings);
};

export const registerTrans = (translations = {}) => {
  cache.translations = {
    ...cache.translations,
    ...translations,
  };
};
