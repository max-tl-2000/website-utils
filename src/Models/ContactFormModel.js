/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

import { FormModel } from 'mobx-form';
import { computed } from 'mobx';
import { trans } from '../common/trans';
import { now } from '../common/moment-utils';
import nullish from '../common/nullish';
import { validateValidEmail, validateValidPhone, combineValidators, validateValidDate, validateDateIsFuture } from '../common/validators';

export default class ContactFormModel extends FormModel {
  @computed
  get timezone() {
    return this.timezoneModel.timezone;
  }

  @computed
  get moveInDate() {
    const { fields, timezone } = this;
    const { value } = fields.moveInDate;
    return value ? value.format('YYYY-MM-DD') : now({ timezone }).startOf('day');
  }

  // TODO: websiste store is better not to be passed here, we might just pass initial data directly
  constructor({ showExtraFields = false, shouldAllowComments = false, webSiteStore = {} } = {}, timezoneModel = {}) {
    const extraFields = showExtraFields
      ? {
          expectedTermLength: '',
          numberOfPets: undefined,
        }
      : {};

    const extraFieldsValidators = showExtraFields
      ? {
          expectedTermLength: {
            interactive: false,
            required: trans('EXPECTED_TERM_LENGTH_REQUIRED', 'Expected term length required'),
          },
          numberOfPets: {
            interactive: false,
            fn: ({ value }) =>
              nullish(value) || Number.isNaN(parseInt(value, 10)) ? { error: trans('NUMBER_OF_PETS_REQUIRED', 'Number of pets required') } : true,
          },
        }
      : {};

    const addCommentsField = shouldAllowComments
      ? {
          message: '',
        }
      : {};

    const initialState = {
      name: webSiteStore?.fullName || '',
      email: webSiteStore?.email || '',
      phone: webSiteStore?.phoneNo || '',
      _name_: 'Mary-Jane Smith',
      _userName_: '',
      moveInDate: webSiteStore?.moveInDate || now({ timezone: timezoneModel.timezone }).startOf('day'),
      moveInTime: webSiteStore?.moveInTime || '',
      ...extraFields,
      ...addCommentsField,
    };

    const validators = {
      name: {
        required: trans('NAME_REQUIRED', 'Full name is required'),
        interactive: false,
      },
      email: {
        required: trans('EMAIL_REQUIRED', 'Email is required'),
        interactive: false,
        fn: validateValidEmail,
      },
      phone: {
        interactive: false,
        required: trans('PHONE_REQUIRED', 'Phone is required'),
        fn: validateValidPhone,
      },
      moveInDate: {
        interactive: false,
        // required: trans('MOVEIN_REQUIRED', 'Move-in date required'),
        fn: combineValidators([validateValidDate, validateDateIsFuture]),
      },
      ...extraFieldsValidators,
    };

    super(initialState, validators);
    this.timezoneModel = timezoneModel;
  }
}
