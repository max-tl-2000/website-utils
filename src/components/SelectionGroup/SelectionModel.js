/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

import { computed, action, observable } from 'mobx';
import clsc from 'coalescy';
import SelectionItem from './SelectionItem';

export default class SelectionModel {
  @observable.shallow
  _items;

  constructor(args) {
    this.update(args);
  }

  _addItem(item, textField, valueField) {
    this._items.push(new SelectionItem(item, textField, valueField));
  }

  _addItems(items = [], textField, valueField) {
    items.forEach(item => this._addItem(item, textField, valueField));
  }

  _sameItemsSelected(ids) {
    const selectedIds = this.selection.ids;

    if (ids && ids.length === selectedIds.length) {
      return ids.every(id => selectedIds.some(it => it === id));
    }

    return false;
  }

  @action
  update({ items, multiple, textField, valueField }) {
    this.multiple = clsc(multiple, false);
    this._items = [];

    this._addItems(items, textField, valueField);
  }

  @computed
  get items() {
    return this._items;
  }

  @computed
  get selection() {
    const selectedItems = this.items.filter(it => it.selected);
    const args = {
      items: [],
      ids: [],
    };

    if (!this.multiple) {
      const current = selectedItems[0];
      if (current) {
        args.items.push(current.originalItem);
        args.ids.push(current.id);
      }
    } else {
      selectedItems.forEach(item => {
        args.items.push(item.originalItem);
        args.ids.push(item.id);
      });
    }

    return args;
  }

  @action
  clearSelection() {
    this.items.forEach(it => it.select(false));
  }

  @action
  select(value, isSelected) {
    const item = this.items.find(it => it.id === value);
    if (!item || item.selected === isSelected) return;

    if (!this.multiple) {
      this.clearSelection();
    }

    // the items are able to be select itself, with this the Map approach is not needed
    // and we can use only es6 high order functions to retrieve the selections
    item.select(isSelected);
  }

  @action
  selectByValues(values) {
    const sameSelected = this._sameItemsSelected(values);
    if (sameSelected) {
      return;
    }

    this.clearSelection();

    values.forEach(value => this.select(value, true));
  }
}
