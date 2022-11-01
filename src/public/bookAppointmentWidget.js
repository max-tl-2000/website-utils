/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { Provider } from 'mobx-react';

import SelfServeWidget from '../BookAppointment/SelfServeWidget/SelfServeWidget';
import { createModels } from '../BookAppointment/createModels';
import { loadBaseStyles } from './init';
import { injectStyles } from '../common/styles-helper';

export const initBookAppointmentWidget = async (selector, options = {}) => {
  if (!selector) throw new Error('selector parameter is missing');

  const {
    domain,
    mode,
    fontURL = 'https://fonts.googleapis.com/css?family=Lato',
    styleURL,
    autoLoadStyles = true,
    token: authToken,
    campaignEmail,
    appointmentToken,
    dynamicFields,
    onAppointmentSave,
    marketingSessionId,
    onEventRaised,
  } = options;

  if (!selector) throw new Error('Selector prop is missing');
  if (!domain) throw new Error('domain prop is missing');

  const element = document.querySelector(selector);
  if (!element) throw new Error(`Selector: "${selector}" not found`);

  const rootClassName = 'revaBookAppointmentRoot';
  const portalClassName = 'revaMountPoint';

  if (autoLoadStyles) {
    await loadBaseStyles({ fontURL, styleURL, loadCSS: true });
  }

  injectStyles({
    id: 'bookAppointmentStyle',
    styles: `
      .${rootClassName},
      .${rootClassName} input,
      .${rootClassName} button,
      .${rootClassName} textarea,
      .${portalClassName}[data-mount-point],
      .${portalClassName}[data-mount-point] input,
      .${portalClassName}[data-mount-point] button,
      .${portalClassName}[data-mount-point] textarea { font-family: 'Lato'; }
    }`,
  });

  const widgetClasses = {
    rootClassName,
    portalClassName,
  };

  const models = {
    ...createModels({
      appointmentToken,
      mode,
      authToken,
      campaignEmail,
      domain,
      dynamicFields,
      onAppointmentSave,
      onEventRaised,
      marketingSessionId,
    }),
    webSiteStore: null,
    widgetClasses,
  };

  render(
    <Provider {...models}>
      <SelfServeWidget className={rootClassName} />
    </Provider>,
    element,
  );

  return {
    models,
    destroy() {
      this.models = null;
      unmountComponentAtNode(element);
    },
  };
};
