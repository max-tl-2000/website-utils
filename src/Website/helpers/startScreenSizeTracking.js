/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

import { reaction } from 'mobx';
import { getWebSiteStore } from '../Stores/WebSiteStore';
import { sizes, screenIsAtLeast } from '../../common/window-size-tracker';
import { qs } from '../../common/dom';

export const startScreenSizeChangeListener = () => {
  const webSiteStore = getWebSiteStore();
  const html = qs('html');

  const addBreakpointNameToHTML = () => {
    const { size } = webSiteStore.screenSizeStore;

    if (html) {
      html.setAttribute('data-size', size);
      Object.keys(sizes).forEach(keyName => {
        const dataName = `data-${keyName}`;
        html.setAttribute(dataName, screenIsAtLeast(size, keyName));
      });
    }
  };

  reaction(() => {
    const { size } = webSiteStore.screenSizeStore;
    return { size };
  }, addBreakpointNameToHTML);

  addBreakpointNameToHTML();
};
