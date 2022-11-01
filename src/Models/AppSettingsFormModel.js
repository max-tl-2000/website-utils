/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

import { FormModel } from 'mobx-form';
import { trans } from '../common/trans';

export default class AppSettingsFormModel extends FormModel {
  constructor(storedState = {}) {
    const { token, host, googleMapsApiToken, defaultPhoneFormat, trackWindowSizeChange } = storedState;
    const initialState = {
      token,
      host,
      googleMapsApiToken,
      defaultPhoneFormat,
      trackWindowSizeChange,
    };

    const validators = {
      token: {
        required: trans('TOKEN_REQUIRED_MSG', 'Token is required'),
        interactive: false,
      },
      host: {
        required: trans('HOST_REQUIRED_MSG', 'Host is required'),
        interactive: false,
      },
      googleMapsApiToken: {
        required: trans('GOOGLE_MAPS_API_TOKEN_REQUIRED', 'Google maps API token is required'),
        interactive: false,
      },
    };

    super(initialState, validators);
  }
}
