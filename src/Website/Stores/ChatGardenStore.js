/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

import { action, computed, observable } from 'mobx';

class ChatGardenStore {
  @observable user = {};

  @observable inventory = {};

  @observable propertyName = '';

  @observable selectedInventory = '';

  // TODO some updates needed here
  @observable inventoryObject = {};

  @observable chatHistory = [];

  @action resetStoredInfo = () => {
    this.user = {};
    this.inventory = {};
    this.selectedInventory = '';
    this.inventoryObject = {};
  };

  // TODO add checks for type
  @action updateUser = (key, value) => {
    this.user[key] = value;
  };

  @action getUserStoreValue = value => (this.user[value] ? this.user[value] : null);

  @action updateInventory = (key, value) => {
    this.inventory[key] = value;
  };

  @action getInventoryStoreValue = value => (this.inventory[value] ? this.inventory[value] : null);

  @action updateProperty = value => {
    this.propertyName = value;
  };

  @action updateSelectedInventory = value => {
    this.selectedInventory = value;
  };

  @action
  updateChatHistory = value => {
    this.chatHistory = value;
  };

  @action
  updateSelectedInventoryObject = value => {
    this.inventoryObject = value;
  };

  @computed
  get storedUserInfo() {
    return this.user;
  }
}

let storeInstance;

export const getChatGardenStore = () => {
  if (!storeInstance) {
    storeInstance = new ChatGardenStore();
  }
  return storeInstance;
};
