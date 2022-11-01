/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

import { observable, action } from 'mobx';

export default class SelectionItem {
  @observable
  selected = false;

  constructor(originalItem, textField = 'text', valueField = 'id', selected = false) {
    this.id = originalItem[valueField];
    this.text = originalItem[textField];

    this.originalItem = originalItem;
    this.selected = selected;
  }

  @action
  select(selected = true) {
    this.selected = selected;
  }
}
