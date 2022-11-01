/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

export const defineProperty = (obj, key, value) => {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value,
      enumerable: true,
      configurable: true,
      writable: true,
    });
  } else {
    obj[key] = value;
  }
  return obj;
};

export const objectSpread = (...args) => {
  const [target] = args;
  for (let i = 1; i < args.length; i++) {
    const source = args[i] != null ? args[i] : {};

    let ownKeys = Object.keys(source);
    if (typeof Object.getOwnPropertySymbols === 'function') {
      ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(sym => Object.getOwnPropertyDescriptor(source, sym).enumerable));
    }
    ownKeys.forEach(key => {
      defineProperty(target, key, source[key]);
    });
  }
  return target;
};
