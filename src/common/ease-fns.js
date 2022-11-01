/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

/* eslint-disable no-restricted-properties */
/**
 * Supports easing for the following commands you can demo at
 * http://ashblue.github.com/canvas-tween-demo/ 'linear', 'quadIn', 'quadOut',
 * 'quadInOut', 'cubeIn', 'cubeOut', 'cubeInOut', 'quartIn', 'quartOut', 'quartInOut',
 * 'quintIn', 'quintOut', 'quintInOut', 'sineIn', 'sineOut', 'sineInOut', 'expoIn',
 * 'expoOut', 'expoInOut', 'circIn', 'circOut', 'circInOut'. Adopted from
 * http://gizma.com/easing/
 * @link http://ashblue.github.com/canvas-tween-demo/
 */

// commented until we can move this to ES6 format so it can be properly tree shaked
/**
 * @param {number} t Current time in millseconds
 * @param {number} b Start value
 * @param {number} c Distance traveled relative to the start value
 * @param {number} d Duration in milliseconds
 */
export const linear = (t, b, c, d) => (c * t) / d + b;

export const quadIn = (t, b, c, d) => {
  t /= d;
  return c * t * t + b;
};

export const quadOut = (t, b, c, d) => {
  t /= d;
  return -c * t * (t - 2) + b;
};

export const quadInOut = (t, b, c, d) => {
  t /= d / 2;
  if (t < 1) {
    return (c / 2) * t * t + b;
  }
  t--;
  return (-c / 2) * (t * (t - 2) - 1) + b;
};

export const cubeIn = (t, b, c, d) => {
  t /= d;
  return c * t * t * t + b;
};

export const cubeOut = (t, b, c, d) => {
  t /= d;
  t--;
  return c * (t * t * t + 1) + b;
};

export const cubeInOut = (t, b, c, d) => {
  t /= d / 2;
  if (t < 1) {
    return (c / 2) * t * t * t + b;
  }
  t -= 2;
  return (c / 2) * (t * t * t + 2) + b;
};

export const quartIn = (t, b, c, d) => {
  t /= d;
  return c * t * t * t * t + b;
};

export const quartOut = (t, b, c, d) => {
  t /= d;
  t--;
  return -c * (t * t * t * t - 1) + b;
};

export const quartInOut = (t, b, c, d) => {
  t /= d / 2;
  if (t < 1) {
    return (c / 2) * t * t * t * t + b;
  }
  t -= 2;
  return (-c / 2) * (t * t * t * t - 2) + b;
};

export const quintIn = (t, b, c, d) => {
  t /= d;
  return c * t * t * t * t * t + b;
};

export const quintOut = (t, b, c, d) => {
  t /= d;
  t--;
  return c * (t * t * t * t * t + 1) + b;
};

export const quintInOut = (t, b, c, d) => {
  t /= d / 2;
  if (t < 1) {
    return (c / 2) * t * t * t * t * t + b;
  }
  t -= 2;
  return (c / 2) * (t * t * t * t * t + 2) + b;
};

export const sineIn = (t, b, c, d) => -c * Math.cos((t / d) * (Math.PI / 2)) + c + b;

export const sineOut = (t, b, c, d) => c * Math.sin((t / d) * (Math.PI / 2)) + b;

export const sineInOut = (t, b, c, d) => (-c / 2) * (Math.cos((Math.PI * t) / d) - 1) + b;

export const expoIn = (t, b, c, d) => c * Math.pow(2, 10 * (t / d - 1)) + b;

export const expoOut = (t, b, c, d) => c * (-Math.pow(2, (-10 * t) / d) + 1) + b;

export const expoInOut = (t, b, c, d) => {
  t /= d / 2;
  if (t < 1) {
    return (c / 2) * Math.pow(2, 10 * (t - 1)) + b;
  }
  t--;
  return (c / 2) * (-Math.pow(2, -10 * t) + 2) + b;
};

export const circIn = (t, b, c, d) => {
  t /= d;
  return -c * (Math.sqrt(1 - t * t) - 1) + b;
};

export const circOut = (t, b, c, d) => {
  t /= d;
  t--;
  return c * Math.sqrt(1 - t * t) + b;
};

export const circInOut = (t, b, c, d) => {
  t /= d / 2;
  if (t < 1) {
    return (-c / 2) * (Math.sqrt(1 - t * t) - 1) + b;
  }
  t -= 2;
  return (c / 2) * (Math.sqrt(1 - t * t) + 1) + b;
};
