/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

import { qs } from './dom';
import { doTween } from './simple-tween';
import { offset } from './offset';

export const scrollToElement = async (scrollable, element) => {
  if (!scrollable) throw new Error('Selector is required');
  if (!element) throw new Error('Component is required ');

  scrollable = typeof selector === 'string' ? qs(scrollable) : scrollable;
  element = typeof element === 'string' ? qs(element) : element;

  const startValue = scrollable.scrollTop;
  const endValue = offset(element).top;

  await doTween({
    startValue,
    endValue,
    duration: 1000,
    tick: ({ v }) => {
      scrollable.scrollTop = v;
    },
  });
};
