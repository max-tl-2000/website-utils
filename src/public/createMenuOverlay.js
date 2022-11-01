/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

import { reaction } from 'mobx';
import { qs, on, contains } from '../common/dom';
import { DialogModel } from '../common/DialogModel';
import { document } from '../common/globals';
import { getWebSiteStore } from '../Website/Stores/WebSiteStore';
import { Categories, Components } from '../Website/helpers/tracking-helper';

export const createMenuOverlay = (selector, onOpenChange) => {
  const $trigger = qs(selector);
  const dlg = new DialogModel();

  on($trigger, 'click', () => {
    dlg.toggleOpen();
  });

  const overlaySelector = $trigger.getAttribute('data-overlay');
  const $overlay = qs(overlaySelector);

  const closeOnTapAway = e => {
    if (!dlg.isOpen) return;
    if (contains($trigger, e.target) || contains($overlay, e.target)) {
      return;
    }
    dlg.close();
  };

  on(document, 'click', closeOnTapAway, true);
  on(document, 'touchstart', closeOnTapAway, true);

  on($overlay, 'click', e => {
    if (!e.target.closest('[data-cmd="closeOverlay"]')) {
      return;
    }
    dlg.close();
  });

  const webSiteStore = getWebSiteStore();
  const { screenSizeStore } = webSiteStore;

  reaction(
    () => ({
      size: screenSizeStore.size,
    }),
    () => {
      if (screenSizeStore.matchXSmall2) {
        dlg.close();
      }
    },
  );

  reaction(
    () => ({
      isOpen: dlg.isOpen,
    }),
    () => {
      $overlay.setAttribute('data-open', dlg.isOpen);
      $trigger.setAttribute('data-open', dlg.isOpen);
      onOpenChange(dlg.isOpen);

      const state = dlg.isOpen ? 'Open' : 'Close';
      const overlayName = $overlay.getAttribute('data-overlay-name');

      if (!overlayName) return;

      webSiteStore.notifyEvent(`${overlayName}StateChange`, {
        category: Categories.NAVIGATION,
        component: Components.OVERLAYS,
        eventLabel: state,
      });
    },
  );
};
