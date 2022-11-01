/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { Provider } from 'mobx-react';
import GuestCardModel from '../Models/GuestCardModel';
import { registerTrans } from '../common/trans';
import { loadStyleSheet } from '../common/loader';
import { createFormEndpointsService } from '../Services/contactFormService';
import { ContactFormDlg } from '../Forms/ContactFormDialog';

export const showFormDialogWidget = async (options = {}) => {
  const {
    domain,
    endpoints = {
      saveForm: '/api/v1/marketing/guestCard',
    },
    translations = {},
    token,
    campaignEmail,
    onClose,
    showExtraFields,
    shouldAllowComments,
    extraData,
    fontUrl = 'https://fonts.googleapis.com/css?family=Lato',
  } = options;

  if (!domain) throw new Error('domain prop is missing');
  if (!endpoints) throw new Error('endpoints prop is missing');
  if (!token) throw new Error('token prop is missing');
  if (!campaignEmail) throw new Error('campaignEmail prop is missing');

  if (fontUrl) {
    loadStyleSheet(fontUrl);
  }

  registerTrans(translations);

  const service = createFormEndpointsService({ domain, endpoints, extraData: { campaignEmail, ...extraData } });

  service.setHeaders({
    Authorization: `Bearer ${token}`,
  });

  // TODO: integrate with the enpoint here
  let models = {
    guestCardModel: new GuestCardModel({ service, showExtraFields, shouldAllowComments }),
    webSiteStore: null,
  };

  const element = document.createElement('div');
  document.body.appendChild(element);

  const cleanUp = () => {
    unmountComponentAtNode(element);
    document.body.removeChild(element);
    onClose && onClose();
    models = null;
  };

  render(
    <Provider {...models}>
      <ContactFormDlg open={true} onCloseRequest={cleanUp} />
    </Provider>,
    element,
  );

  return {
    models,
    cleanUp,
  };
};
