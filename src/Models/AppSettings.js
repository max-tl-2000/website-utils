/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

import { observable, action } from 'mobx';
import { getWebSettings, saveWebSettings, clearWebSettings } from '../Website/helpers/settings-state';
import AppSettingsFormModel from './AppSettingsFormModel';

export default class AppSettings {
  constructor(defaults) {
    this.defaults = defaults;
  }

  @observable.shallow
  settings = getWebSettings() || this.defaults;

  @action
  saveSettings(newSettings) {
    this.settings = newSettings;
    saveWebSettings(this.settings);
  }

  getEditableFormModel() {
    return new AppSettingsFormModel(this.settings);
  }

  restoreSettings = () => {
    clearWebSettings();
    this.settings = {};
  };
}
