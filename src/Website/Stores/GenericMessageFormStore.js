/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

import { computed, action } from 'mobx';
import Request from '../../common/request';
import { getWebSiteService } from '../../Services/WebSiteService';

export default class GenericMessageFormStore {
  @computed
  get loading() {
    return this.genericMessageFormRq.loading;
  }

  @computed
  get loaded() {
    return this.genericMessageFormRq.success;
  }

  constructor() {
    const websiteService = getWebSiteService();

    this.genericMessageFormRq = Request.create({
      defaultResponse: {},
      call: async ({ formId, data, message }) => {
        try {
          return websiteService.submitGenericForm({
            formId,
            message,
            data,
          });
        } catch (error) {
          console.log('Error submitting form', error);
          throw new Error(error);
        }
      },
    });
  }

  @computed
  get error() {
    return this.genericMessageFormRq.error;
  }

  @action
  save = async payload => {
    await this.genericMessageFormRq.execCall(payload);
    return this.genericMessageFormRq.success;
  };

  @action
  clearError = () => {
    this.genericMessageFormRq.clearError();
  };
}
