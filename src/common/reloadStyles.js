/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

import { qsa } from './dom';
import { combineWithParams } from './serialize';

export const reloadStyles = () => {
  const links = qsa('link[rel="stylesheet"]');
  links.forEach(l => {
    if (l.href.indexOf('blob:') === 0) return;

    l.href = combineWithParams(l.href, { rand: Date.now() });
  });
};
