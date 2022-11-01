/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

import { action, observable, computed } from 'mobx';

export default class TimezoneModel {
  @observable
  _timezone;

  @action
  setTimezone(tz) {
    this._timezone = tz;
  }

  @computed
  get timezone() {
    return this._timezone || '';
  }
}
