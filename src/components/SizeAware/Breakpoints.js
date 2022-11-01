/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

export const XSMALL1 = 0; // to 480
export const XSMALL2 = 481; // to 600
export const SMALL1 = 601; // to 841
export const SMALL2 = 841; // to 960
export const MEDIUM = 961; // to 1264
export const LARGE = 1265; // to 1904
export const XLARGE = 1905; // to Infinity (an beyond)

export const defaultBreakpointsAsArray = [
  { xsmall1: 0 },
  { xsmall2: XSMALL2 },
  { small1: SMALL1 },
  { small2: SMALL2 },
  { medium: MEDIUM },
  { large: LARGE },
  { xlarge: XLARGE },
];
