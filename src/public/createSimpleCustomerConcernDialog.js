/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

import { renderComponent } from '../common/render-helper';
import { getWebSiteStore } from '../Website/Stores/WebSiteStore';
import DynamicFormDialogWrapper from '../Website/Containers/DynamicForm/DynamicFormDialogWrapper';
import { trans } from '../common/trans';
import { now } from '../common/moment-utils';
import { DATE_AND_TIME_12H_FORMAT } from '../Website/helpers/dateConstants';

const formId = 'residentConcerns';

const getMessageBody = (data, { timezone }) => {
  const renderParagraph = (prefix, message) => message && `<p>${prefix}: ${message}</p>`;
  const currentTime = now({ timezone }).format(DATE_AND_TIME_12H_FORMAT);
  const { propertyName, city, state } = data.property || {};

  return `
    <div>
      ${renderParagraph('Property', propertyName)}
      ${renderParagraph('City', city)}
      ${renderParagraph('State', state)}
      ${renderParagraph('Full Name', data.fullName)}
      ${renderParagraph('Phone', data.phone)}
      ${renderParagraph('Email', data.email)}
      ${renderParagraph('Message', data.message)}
      ${renderParagraph('Date & Time', currentTime)}
    </div>
  `;
};

const sanitizePropertyDisplayName = displayName => displayName.toLowerCase().replace(/[^a-z]/g, '');

const existsCommunity = ({ property }, communities) => {
  const { propertyName = '' } = property || {};
  const sanitizedPropertyDisplayName = sanitizePropertyDisplayName(propertyName);
  return communities.some(community => sanitizedPropertyDisplayName === sanitizePropertyDisplayName(community));
};

const getMessageData = (targetsByCommunity, data, args) => {
  const targetEmail = Object.entries(targetsByCommunity).reduce((acc, [to, communities]) => {
    if (acc) return acc;
    return existsCommunity(data, communities) ? to : '';
  }, '');

  if (!targetEmail) {
    throw new Error('Invalid Community');
  }

  return {
    to: targetEmail,
    subject: 'Resident Concern',
    body: getMessageBody(data, args),
  };
};

const formatData = data => ({
  ...data,
  property: {
    propertyId: data.property.propertyId,
    city: data.property.city,
    state: data.property.state,
  },
});

const processPayload = async (payload, targetsByDepartment) => {
  const webSiteStore = getWebSiteStore();

  return {
    formId,
    data: formatData(payload),
    message: getMessageData(targetsByDepartment, payload, { timezone: webSiteStore.currentPropertyStore?.timezone || 'America/Chicago' }),
  };
};

export const createSimpleCustomerConcernDialog = (selector, { onSubmitClick, translations = {}, targetsByCommunity = {} } = {}) => {
  const webSiteStore = getWebSiteStore();

  return renderComponent(DynamicFormDialogWrapper, {
    selector,
    stores: { webSiteStore, actions: { onSubmitClick } },
    props: {
      formId,
      transformPayload: async payload => await processPayload(payload, targetsByCommunity),
      fields: {
        property: {
          value: undefined,
          validators: ['VALID_COMMUNITY'],
          meta: {
            type: 'QueryFilter',
            label: 'Search Community Name*',
            noMatchFoundText: trans('CUSTOMER_CONCERN_NO_MATCH_FOUND', 'No matching communities found. Check the spelling of the community and try again'),
            autoFocus: true,
          },
        },
        fullName: {
          value: '',
          meta: {
            type: 'TextBox',
            label: 'Full Name',
          },
        },
        phone: {
          value: '',
          validators: ['VALID_PHONE'],
          meta: {
            type: 'TextBox',
            label: 'Phone',
          },
        },
        email: {
          value: '',
          validators: ['VALID_EMAIL'],
          meta: {
            type: 'TextBox',
            label: 'Email',
          },
        },
        message: {
          value: '',
          required: 'Message is required',
          meta: {
            type: 'TextArea',
            label: 'Message*',
          },
        },
      },
      translations: {
        triggerLabel: translations.triggerLabel || trans('SEND_FEEDBACK', 'Send Feedback'),
        formTitle: translations.formTitle || trans('CUSTOMER_CONCERNS', 'Customer Concerns'),
        thankYouTitle: translations.thankYouTitle || trans('THANK_YOU_FOR_SUBMITTING_YOUR_CONCERNS', 'Thank you for submitting your concerns'),
        thankYouSubTitle: translations.thankYouSubTitle || trans('CONCERN_WILL_GET_BACK_MESSAGE', 'A manager will get back to you as soon as possible'),
        thankYouCloseLabel: translations.thankYouCloseLabel || trans('CONTINUE_EXPLORING_YOUR_COMMUNITY', 'Continue exploring your community'),
        submitLabel: translations.submitLabel || trans('SEND', 'Send'),
        errorSummaryTitle: translations.errorSummaryTitle || trans('ERROR_SUMMARY_TITLE', ' Some of the required fields are missing'),
        errorMessage:
          translations.errorMessage || trans('ERROR_MESSAGE_FOR_SEND_MESSAGE', "Sorry, we couldn't send the message out. Please try again in a few minutes"),
      },
    },
  });
};
