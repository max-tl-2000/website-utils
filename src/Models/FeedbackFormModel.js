/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

import { FormModel } from 'mobx-form';
import { trans } from '../common/trans';

export default class FeedbackFormModel extends FormModel {
  constructor() {
    const initialState = {
      feedback: '',
    };

    const validators = {
      feedback: {
        required: trans('NAME_REQUIRED', 'Feedback is required'),
        interactive: false,
      },
    };

    super(initialState, validators);
  }
}
