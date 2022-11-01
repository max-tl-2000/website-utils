/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

import { getWebSiteStore } from '../Website/Stores/WebSiteStore';
import { parseAPhone } from '../common/phone/phone-helper';
import { qsa, qs } from '../common/dom';

const replacePhone = (phoneSelector, phone, { replaceContent = true } = {}) => {
  const thePhone = parseAPhone(phone);
  const formattedPhone = thePhone.format();

  qsa(phoneSelector).forEach(el => {
    el.setAttribute('href', `tel:${phone}`);
    if (replaceContent || el.getAttribute('data-replace-content') === 'true') {
      el.innerHTML = formattedPhone;
    }
  });
};

const replaceSms = (smsSelector, phone, { replaceContent = true } = {}) => {
  const thePhone = parseAPhone(phone);
  const formattedPhone = thePhone.format();

  qsa(smsSelector).forEach(el => {
    el.setAttribute('href', `sms:${phone}`);
    if (replaceContent || el.getAttribute('data-replace-content') === 'true') {
      el.innerHTML = formattedPhone;
    }
  });
};

const replaceEmail = (smsSelector, email, { replaceContent = false, processNode } = {}) => {
  qsa(smsSelector).forEach(el => {
    // if we specify a custom function to transform the email
    // we wil use it instead of the default behavior
    if (processNode) {
      processNode(el, email);
      return;
    }

    el.setAttribute('href', `mailto:${email}`);
    if (replaceContent || el.getAttribute('data-replace-content') === 'true') {
      el.innerHTML = email;
    }
  });
};

const getInput = formEl => {
  let input = qs('[data-id="marketingSessionId"]', formEl);

  if (!input) {
    input = document.createElement('input');
    input.setAttribute('data-id', 'marketingSessionId');
    input.type = 'hidden';
    input.name = 'marketingSessionId';
    formEl.appendChild(input);
  }

  return input;
};

const replaceForm = (formSelector, marketingSessionId) => {
  qsa(formSelector).forEach(formEl => {
    const input = getInput(formEl);
    input.value = marketingSessionId;
  });
};

export const replaceMarkupInDOM = ({
  phoneSelector = '.reva-phone-class',
  phoneLinkSelector = '.reva-phone-link-class',
  smsSelector = '.reva-sms-class',
  smsLinkSelector = '.reva-sms-link-class',
  emailSelector = '.reva-email-link-class',
  formSelector = '.reva-form-class',
  processEmail,
  waitForDOMReady,
} = {}) => {
  const websiteStore = getWebSiteStore();

  const sessionPromise = websiteStore.getMarketingSession();

  const doReplacement = async () => {
    const session = await sessionPromise;
    const { phone, email, marketingSessionId } = session;

    if (phoneSelector && phone) {
      replacePhone(phoneSelector, phone);
    }

    if (phoneLinkSelector && phone) {
      replacePhone(phoneLinkSelector, phone, { replaceContent: false });
    }

    if (smsLinkSelector && phone) {
      replaceSms(smsLinkSelector, phone, { replaceContent: false });
    }

    if (smsSelector && phone) {
      replaceSms(smsSelector, phone);
    }

    if (emailSelector && email) {
      replaceEmail(emailSelector, email, { processNode: processEmail });
      // Keep support the old default
      if (emailSelector === '.reva-email-link-class') {
        replaceEmail('.reva-email-class', email, { processNode: processEmail });
      }
    }

    if (formSelector) {
      replaceForm(formSelector, marketingSessionId);
    }
  };

  if (waitForDOMReady) {
    document.addEventListener('DOMContentLoaded', doReplacement);
    return;
  }

  doReplacement();
};
