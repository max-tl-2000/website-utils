/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

import ResizeObserver from 'resize-observer-polyfill';

export const getSizeObserver = (ele, onResize) => {
  let obs;
  let timer;

  const observerInterface = {
    stop: () => {
      clearTimeout(timer);
      obs.unobserve(ele);
      obs.disconnect();
    },
  };

  const THRESHOLD_TO_RAISE_FIRST_SIZE_CHANGE = 16;

  const raiseSizeChange = entry => {
    const { contentRect } = entry;
    if (!onResize) return;
    timer = setTimeout(() => onResize(contentRect), THRESHOLD_TO_RAISE_FIRST_SIZE_CHANGE);
  };

  obs = new ResizeObserver(entries => {
    for (const entry of entries) {
      raiseSizeChange(entry);
    }
  });

  obs.observe(ele);

  return observerInterface;
};
