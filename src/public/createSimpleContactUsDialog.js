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

const formId = 'genericContactUs';

const getMessageBody = (data, { timezone }) => {
  const renderParagraph = (prefix, message) => message && `<p>${prefix}: ${message}</p>`;
  const currentTime = now({ timezone }).format(DATE_AND_TIME_12H_FORMAT);

  return `
    <div>
      ${renderParagraph('Department', data.departmentId)}
      ${renderParagraph('Full Name', data.fullName)}
      ${renderParagraph('Phone', data.phone)}
      ${renderParagraph('Email', data.email)}
      ${renderParagraph('Message', data.message)}
      ${renderParagraph('Date & Time', currentTime)}
    </div>
  `;
};

const getMessageData = (targetsByDepartment, data, args) => {
  const departmentKey = Object.keys(targetsByDepartment).find(key => key.toLowerCase() === data.departmentId.toLowerCase());
  if (!departmentKey) {
    throw new Error('Invalid department');
  }
  return {
    ...targetsByDepartment[departmentKey],
    body: getMessageBody(data, args),
  };
};

const processPayload = async (payload, targetsByDepartment) => {
  const webSiteStore = getWebSiteStore();

  return {
    formId,
    data: payload,
    message: getMessageData(targetsByDepartment, payload, { timezone: webSiteStore.currentPropertyStore?.timezone || 'America/Chicago' }),
  };
};

export const createSimpleContactUsDialog = (selector, { onSubmitClick, translations = {}, targetsByDepartment = {} } = {}) => {
  const webSiteStore = getWebSiteStore();

  return renderComponent(DynamicFormDialogWrapper, {
    selector,
    stores: { webSiteStore, actions: { onSubmitClick } },
    props: {
      formId,
      transformPayload: async payload => await processPayload(payload, targetsByDepartment),
      fields: {
        departmentId: {
          value: undefined,
          required: trans('INVALID_DEPARTMENT_REQUIRED', 'Department selection is required'),
          meta: {
            type: 'Dropdown',
            label: 'Select Department*',
            big: true,
            autoFocus: true,
            items: Object.keys(targetsByDepartment).map(it => ({ id: it, value: it })),
          },
        },
        fullName: {
          value: '',
          required: 'Full Name is required',
          meta: {
            type: 'TextBox',
            label: 'Full Name*',
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
          required: 'Email is required',
          validators: ['VALID_EMAIL'],
          meta: {
            type: 'TextBox',
            label: 'Email*',
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
        triggerLabel: translations.triggerLabel || trans('SEND_MESSAGE', 'Send Message'),
        formTitle: translations.formTitle || trans('CONTACT_US_TITLE', 'Contact Us'),
        thankYouTitle: translations.thankYouTitle || trans('THANK_YOU_FOR_CONTACTING_US', 'Thank you for contacting us'),
        thankYouSubTitle: translations.thankYouSubTitle || trans('WE_WILL_GET_BACK', "We'll have someone get back to you soon"),
        thankYouCloseLabel: translations.thankYouCloseLabel || trans('CLOSE', 'Close'),
        submitLabel: translations.submitLabel || trans('SEND', 'Send'),
        errorSummaryTitle: translations.errorSummaryTitle || trans('ERROR_SUMMARY_TITLE', ' Some of the required fields are missing'),
        errorMessage:
          translations.errorMessage || trans('ERROR_MESSAGE_FOR_SEND_MESSAGE', "Sorry, we couldn't send the message out. Please try again in a few minutes"),
      },
    },
  });
};
