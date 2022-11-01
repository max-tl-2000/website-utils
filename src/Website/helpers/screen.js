/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

import nullish from '../../common/nullish';

const _getDevicePixelRatio = () => {
  const devicePixelRatio = Math.round(window?.devicePixelRatio || 1);
  if (devicePixelRatio <= 1) return 1;
  if (devicePixelRatio <= 2) return 2;
  return 3;
};

export const getDevicePixelRatio = maxDPR => {
  const dpr = _getDevicePixelRatio();
  return dpr > maxDPR ? maxDPR : dpr;
};

export const windowWidth = () => {
  const innerWidth = window.innerWidth;
  const clientWidth = document?.documentElement?.clientWidth;

  return !nullish(innerWidth) && !nullish(clientWidth)
    ? Math.min(innerWidth, clientWidth)
    : innerWidth || clientWidth || document.getElementsByTagName('body')[0].clientWidth;
};

export const windowHeight = () => {
  const innerHeight = window.innerHeight;
  const clientHeight = document?.documentElement?.clientHeight;

  return !nullish(innerHeight) && !nullish(clientHeight)
    ? Math.min(innerHeight, clientHeight)
    : innerHeight || clientHeight || document.getElementsByTagName('body')[0].clientHeight;
};

export const isPortrait = () => {
  const height = windowHeight();
  const width = windowWidth();

  return height >= width;
};

export const isLandscape = () => {
  const height = windowHeight();
  const width = windowWidth();

  return height < width;
};
