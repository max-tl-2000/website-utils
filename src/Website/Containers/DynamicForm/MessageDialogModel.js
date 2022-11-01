/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

import { observable, action, computed } from 'mobx';
import { DialogModel } from '../../../common/DialogModel';

export class MessageDialogModel extends DialogModel {
  @observable
  _wizardIndex = 0;

  constructor({ open } = {}) {
    super({ open });
  }

  @computed
  get wizardIndex() {
    return this._wizardIndex;
  }

  @action
  setWizardIndex = index => {
    this._wizardIndex = index;
  };
}
