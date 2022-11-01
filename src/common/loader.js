/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

import { deferred } from './deferred';

export const loadStyleSheet = async href => {
  const dfd = deferred();

  const { document: doc } = window;

  const lnk = doc.createElement('link');

  lnk.setAttribute('rel', 'stylesheet');
  lnk.setAttribute('href', href);

  lnk.addEventListener('error', dfd.reject);

  lnk.addEventListener('load', () => {
    dfd.resolve(lnk);
  });

  doc.head.appendChild(lnk);

  return dfd;
};

export const loadJS = async src => {
  const dfd = deferred();

  const { document: doc } = window;
  const script = doc.createElement('script');
  script.setAttribute('type', 'text/javascript');
  script.setAttribute('src', src);

  script.addEventListener('error', dfd.reject);

  script.addEventListener('load', () => {
    dfd.resolve(script);
  });

  doc.head.appendChild(script);

  return dfd;
};
