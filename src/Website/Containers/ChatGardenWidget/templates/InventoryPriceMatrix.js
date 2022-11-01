/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

'use strict';

import { action, observable } from 'mobx';
import { observer } from 'mobx-react';
import React, { Component } from 'react';
import { getChatGardenStore } from '../../../Stores/ChatGardenStore';
import { getWebSiteStore } from '../../../Stores/WebSiteStore';
import ChatSelection from '../ChatSelection';

const capitalize = s => s[0].toUpperCase() + s.slice(1);

@observer
export class InventoryPriceMatrix extends Component {
  @observable
  pricingMatrix = null;

  @action
  updatePricingMatrix = value => {
    this.pricingMatrix = value.map(mat => ({
      displayText: `${mat.termLength} ${capitalize(mat.period)}${mat.termLength !== 1 ? 's' : ''} - $${mat.marketRent}${mat.termLength !== 1 ? '/mo' : ''}`,
      conversationConsumer: `${mat.termLength} ${mat.marketRent}`,
      targetStep: mat.period,
    }));
  };

  // Pull Inventory Pricing Matrix
  componentDidMount = async () => {
    const chatGardenStore = getChatGardenStore();
    const webSiteStore = getWebSiteStore();

    const inventoryId = chatGardenStore.inventoryObject.inventoryId;
    const propertyId = webSiteStore.currentPropertyId;
    const moveInDateValue = chatGardenStore?.user.selectedMoveInDate;
    const inventoryPricingMatrix = await webSiteStore.webSiteService.getInventoryPricing({
      inventoryId,
      moveInDate: moveInDateValue,
      propertyId,
    });
    const inventoryPricingCombinedMatrix = [...inventoryPricingMatrix?.terms, ...inventoryPricingMatrix?.additionalTerms];
    this.updatePricingMatrix(inventoryPricingCombinedMatrix.sort((a, b) => a.termLength - b.termLength));
  };

  onAddNewDialog = leaseTerm => {
    const chatGardenStore = getChatGardenStore();
    const values = leaseTerm.split(' ');

    chatGardenStore.updateInventory('termLength', parseInt(values[0], 10));
    chatGardenStore.getInventoryStoreValue('termLength');

    this.props.handleSubmit(
      values[1],
      'selectLeaseTerm',
      `Get me a quote for ${values[0]} ${values[0] === '1' ? 'months' : 'month'} starting at $${values[1]}/month.`,
    );
  };

  render() {
    return <>{this.pricingMatrix && <ChatSelection buttons={this.pricingMatrix} onAddNewDialog={this.onAddNewDialog} />}</>;
  }
}
