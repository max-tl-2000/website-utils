/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

import { computed, action } from 'mobx';
import { renderComponent } from '../common/render-helper';
import { getWebSiteStore } from '../Website/Stores/WebSiteStore';
import DynamicFormWrapper, { DynamicFormDialogWrapper } from '../Website/Containers/DynamicForm/DynamicFormWrapper';
import { trans } from '../common/trans';
import { getWebSiteService } from '../Services/WebSiteService';
import { DialogModel } from '../common/DialogModel';
import Request from '../common/request';

class DynamicFormModel {
  @computed
  get loading() {
    return this.rq.loading;
  }

  @computed
  get loaded() {
    return this.rq.success;
  }

  constructor(webSiteService) {
    this.rq = Request.create({
      defaultResponse: {},
      call: async payload => {
        try {
          return await webSiteService.sendContactUsInfo(payload);
        } catch (error) {
          console.error('Error submitting form', error);
          throw new Error(error);
        }
      },
    });
  }

  @computed
  get error() {
    return this.rq.error;
  }

  @action
  save = async payload => {
    await this.rq.execCall(payload);
    return this.rq.success;
  };

  @action
  clearError = () => {
    this.rq.clearError();
  };
}

const processPayload = async payload => {
  const { fullName, email, phone, propertyId, numBedrooms } = payload;

  return {
    name: fullName,
    email,
    phone,
    qualificationQuestions: { numBedrooms: [numBedrooms] },
    propertyId,
  };
};

const renderComponentForContactUsForm = (
  Cmpnt,
  selector,
  { horizontal, onSubmitClick, translations = {}, messageAfterSuccess, showLabels = true, onResetRequest, showConfirmCardAfterSuccess = true } = {},
  extraProps = {},
) => {
  const webSiteStore = getWebSiteStore();
  const webSiteService = getWebSiteService();

  const model = new DynamicFormModel(webSiteService);

  return renderComponent(Cmpnt, {
    selector,
    stores: { webSiteStore, actions: { onSubmitClick } },
    props: {
      horizontal,
      transformPayload: async payload => await processPayload(payload),
      showTitle: false,
      onResetRequest,
      showConfirmCardAfterSuccess,
      showLabels,
      messageAfterSuccess,
      buttonTitle: 'Get Info',
      formId: 'genericContactUs',
      noPaddingAtSides: true,
      model,
      fields: {
        fullName: {
          value: '',
          required: 'Full Name is required',
          meta: {
            type: 'TextBox',
            label: 'Full Name*',
            placeholder: 'Jane Doe',
            columns: 2.5,
            last: false,
          },
        },
        phone: {
          value: '',
          validators: ['VALID_PHONE'],
          meta: {
            type: 'TextBox',
            label: 'Phone',
            placeholder: '415-555-1234',
            columns: 2.5,
            last: false,
          },
        },
        email: {
          value: '',
          required: 'Email is required',
          validators: ['VALID_EMAIL'],
          meta: {
            type: 'TextBox',
            label: 'Email*',
            placeholder: 'jane@email.com',
            columns: 2.5,
            last: false,
          },
        },
        numBedrooms: {
          value: undefined,
          required: trans('NUM_BEDROOMS_REQUIRED', 'Number of bedrooms required'),
          meta: {
            type: 'Dropdown',
            label: '# of Bedrooms',
            placeholder: 'Select one',
            big: true,
            columns: 2.5,
            last: false,
            items: [
              {
                id: 'ONE_BED',
                value: '1',
              },
              {
                id: 'TWO_BEDS',
                value: '2',
              },
              {
                id: 'THREE_BEDS',
                value: '3',
              },
            ],
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
      // this is for the button in case of horizontal layout
      buttonColumns: 2,
      buttonSmall: false,
      showIcon: false,
      ...extraProps,
    },
  });
};

export const createContactUsForm = (
  selector,
  {
    horizontal,
    onSubmitClick,
    translations = {
      thankYouCloseLabel: 'continue exploring your community',
    },
    messageAfterSuccess,
    showLabels = true,
    onResetRequest,
    showConfirmCardAfterSuccess,
  } = {},
) =>
  renderComponentForContactUsForm(DynamicFormWrapper, selector, {
    horizontal,
    onSubmitClick,
    translations,
    messageAfterSuccess,
    showLabels,
    onResetRequest,
    showConfirmCardAfterSuccess,
  });

export const createContactDialog = (selector, { horizontal, onSubmitClick, translations = {}, messageAfterSuccess, showLabels = true } = {}) => {
  const dlgModel = new DialogModel();

  renderComponentForContactUsForm(
    DynamicFormDialogWrapper,
    selector,
    {
      horizontal,
      onSubmitClick,
      translations,
      messageAfterSuccess,
      showLabels,
      showConfirmCardAfterSuccess: true,
      onResetRequest: () => {
        dlgModel.close();
      },
    },
    { dlgModel },
  );

  return dlgModel;
};
