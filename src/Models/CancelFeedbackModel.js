/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

import { computed, action } from 'mobx';
import FeedbackFormModel from './FeedbackFormModel';
import Request from '../common/request';

export default class CancelFeedbackModel {
  constructor({ service, selfServeModel } = {}) {
    this.feedbackForm = new FeedbackFormModel();

    this.saveFeedbackRq = Request.create({
      call: payload => service.saveFeedback({ ...payload, token: selfServeModel.appointmentToken }),
    });
  }

  @action
  saveFeedback = async data => {
    const { saveFeedbackRq, onFeedbackShared } = this;
    await saveFeedbackRq.execCall(data);
    if (saveFeedbackRq.success) {
      onFeedbackShared && onFeedbackShared();
    }
  };

  @computed
  get sendingFeedback() {
    return this.saveFeedbackRq.loading;
  }

  @computed
  get feedbackSentError() {
    return this.saveFeedbackRq.error;
  }
}
