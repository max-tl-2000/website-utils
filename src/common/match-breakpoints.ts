/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

interface IBreakpointsObj {
  [breakpoint: string]: [number, number];
}

type BreakpointObj = { [key: string]: number };

type IBreakpointsArr = BreakpointObj[];

interface IMatches {
  [breakpoint: string]: boolean;
}

type IBreakpoints = IBreakpointsObj | IBreakpointsArr;

export const matchBreakpoints = (breakpoints: IBreakpoints = {}, width: number) => {
  let currentBreakpoint: string | undefined;
  const matches: IMatches = {};

  if (Array.isArray(breakpoints)) {
    for (let i = 0, len = breakpoints.length; i < len; i++) {
      const obj = breakpoints[i];
      const [key] = Object.keys(obj);
      const min = obj[key];

      const isInsideBreakpoint = min <= width;

      if (isInsideBreakpoint) {
        currentBreakpoint = key;
      }

      matches[key] = isInsideBreakpoint;
    }
    return { currentBreakpoint, matches };
  }

  const keys: string[] = Object.keys(breakpoints);

  for (let i = 0, len = keys.length; i < len; i++) {
    const bpKey = keys[i];
    const bp = breakpoints[bpKey];
    const min = bp[0];
    const max = bp[1] || Infinity;

    if (min >= max) {
      throw new Error(`Invalid breakpoint. Min (${min}) cannot be greater or equal than Max (${max})`);
    }
    if (min <= width && width <= max) {
      currentBreakpoint = bpKey;
    }

    matches[bpKey] = min <= width;
  }

  return { currentBreakpoint, matches };
};
