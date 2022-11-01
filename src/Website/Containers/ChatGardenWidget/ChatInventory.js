/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

import classnames from 'classnames/bind';
import React, { Component } from 'react';
import { action, observable } from 'mobx';
import { observer } from 'mobx-react';
import moment from 'moment';
import { getWebSiteStore } from '../../Stores/WebSiteStore';
import stylesTemplate from './ChatTemplateSelector.scss';
import Avatar from '../../../components/Avatar/Avatar';
import Dialog from '../../../components/Dialog/Dialog';
import botAvatar from './assets/avatar.png';
import CarouselSelector from './templates/CarouselSelector';
import ChatSelection from './ChatSelection';
import AvailableUnits from './templates/AvailableUnits';
import { getChatGardenStore } from '../../Stores/ChatGardenStore';
import { trans } from '../../../common/trans';
import * as T from '../../../components/Typography/Typopgraphy';
import PhoneButton from '../../Components/PhoneButton/PhoneButton';
import { MONTH_DAY_YEAR_FORMAT, YEAR_MONTH_DAY_FORMAT } from '../../helpers/dateConstants';

// TODO: DUP, should put these in a global
const chatLocalStorage = window.localStorage;
const chatGardenStore = getChatGardenStore();
const cx = classnames.bind(stylesTemplate);
const TEMP_AVATAR = botAvatar;
const strings = {
  USER: 'user',
  BOT: 'bot',
  DIALOG: 'dialog',
};

// A lot going on here. Will split into multiple files... but first...
const supplantCopy = (string, o) =>
  string.replace(/\[([^[\]]*)\]/g, (a, b) => {
    const r = o[b];
    return typeof r === 'string' || typeof r === 'number' ? r : a;
  });

@observer
export class ChatInventory extends Component {
  // Temp, holding these values in an object
  @observable
  inventoryStore = {
    moveInDate: null,
    numOfBedrooms: null,
    selectedLayoutId: null,
    selectedLayout: null,
    lowestRent: null,
  };

  @observable
  propertyId = null;

  @observable
  roomMatrix = [];

  @observable
  selectedInventory = null;

  @observable
  pricingMatrix = [];

  @observable
  selectedInventoryItem = null;

  @observable
  availableUnit = null;

  @observable
  inventoryMatrix = [];

  @observable
  dialogs = [];

  @observable
  storedHistoryValues = [];

  @action
  updateAvailableUnit = value => {
    this.availableUnit = value;
  };

  @action
  updateStoredHistoryValues = value => {
    this.storedHistoryValues = [...this.storedHistoryValues, value];
  };

  @action
  updateInventoryStore = (key, value) => {
    this.inventoryStore[key] = value;
  };

  @action
  updatePropertyId = value => {
    this.propertyId = value;
  };

  @action
  updatePricingMatrix = value => {
    this.pricingMatrix = value.map(mat => ({
      displayText: `${mat.termLength} ${mat.period}${parseInt(mat.period, 10) > 1 ? 's' : ''} - $${mat.marketRent}/mo`,
      conversationConsumer: `${mat.termLength}_${mat.period}`,
      targetStep: mat.period,
    }));
  };

  @action
  updateSelectedInventory = value => {
    this.selectedInventory = value || [];
  };

  @action
  updateRoomMatrix = value => {
    this.roomMatrix = value.map(mat => ({
      displayText: mat.displayName,
      conversationConsumer: mat.id,
      targetStep: mat.id,
    }));
  };

  @action
  selectInventoryItem = value => {
    this.selectedInventoryItem = value;
  };

  @action
  updateInventoryMatrix = value => {
    this.inventoryMatrix = value;
  };

  @action
  addConsumerDialogs = value => {
    this.dialogs = value;
  };

  retrieveLowestRent = layouts => {
    const { inventory } = layouts;
    let lowestRent = 0;
    inventory.forEach(inv => {
      if (!lowestRent) {
        lowestRent = inv.lowestMonthlyRent;
      } else if (lowestRent < inv.lowestRent) {
        lowestRent = inv.lowestMonthlyRent;
      }
    });
    this.updateInventoryStore('lowestRent', lowestRent);
  };

  onAddNewDialog = () => {
    this.props.handleSubmit();
  };

  // Temp while we get the matrix working
  correctBedCount = bedcount => parseInt(bedcount.split(' ')[0], 10);

  // Retrieve inventory for a group
  selectRoomType = async id => {
    // The below simply toggles the bedroom response
    const bedString = this.roomMatrix.find(data => data.targetStep === id);
    this.updateInventoryStore('numOfBedrooms', bedString.displayText);

    this.updateStoredHistoryValues({
      voice: strings.USER,
      component: strings.DIALOG,
      text: supplantCopy(this.dialogs.bedCountConversationConsumer, { selectedBedroomCount: this.inventoryStore.numOfBedrooms }),
    });
    const webSiteStore = getWebSiteStore();
    const inventoryLayouts = await webSiteStore.webSiteService.getLayouts({ propertyId: this.propertyId, marketingLayoutGroupId: id });

    this.updateStoredHistoryValues({
      voice: strings.BOT,
      component: strings.DIALOG,
      text: supplantCopy(this.dialogs.layoutConversationContext, {
        inventoryAvailabilityDate: this.inventoryStore.moveInDate,
        selectedMarketingLayoutGroupBedCount: this.inventoryStore.numOfBedrooms,
      }),
    });

    // TEMP hardcoding these values: clean up later
    const storeFieldBedCount = 'selectedMarketingLayoutGroupBedCount';
    chatGardenStore.updateInventory(storeFieldBedCount, this.correctBedCount(this.inventoryStore.numOfBedrooms)); // early work
    chatLocalStorage.setItem(`reva_chat_${storeFieldBedCount}`, this.correctBedCount(this.inventoryStore.numOfBedrooms)); // persist, remove in next iteration
    this.updateInventoryMatrix(inventoryLayouts);
    this.props.handleScroll();
  };

  // getInventoryLayouts
  getInventoryLayouts = layouts => {
    const selectedLayoutsId = layouts.inventory;
    this.retrieveLowestRent(layouts);
    this.updateInventoryStore('selectedLayout', layouts.displayName);
    // STORE HISTORY: User dialog, show pictures for the selected inventory group
    this.updateStoredHistoryValues({
      voice: strings.USER,
      component: strings.DIALOG,
      text: this.dialogs.layoutConversationConsumer,
    });
    this.updateAvailableUnit(layouts?.inventory);
    // STORE HISTORY: Store Bot response to user asking for inventory of groups
    this.updateStoredHistoryValues({
      voice: strings.BOT,
      component: strings.DIALOG,
      text: layouts?.inventory
        ? supplantCopy(this.dialogs.inventoryConversationContext, {
            selectedMarketingLayout: this.inventoryStore.selectedLayout,
            selectedMarketingLayoutLowestRent: this.inventoryStore.lowestRent,
          })
        : trans('AVAILABILITY_MESSAGE', 'Apologies, we currently do not have any inventory of that type available, but availability changes all the time.'),
    });
    this.updateSelectedInventory(selectedLayoutsId);

    const storeFieldInventoryLayout = 'selectedMarketingLayout';
    chatGardenStore.updateInventory(storeFieldInventoryLayout, layouts.displayName);

    chatLocalStorage.setItem(`reva_chat_${storeFieldInventoryLayout}`, layouts.displayName); // persist, remove in next iteration

    this.props.handleScroll();
  };

  // Return the object for selected inventory option
  selectInventoryOption = async inventory => {
    const { updateSelectedInventory = {}, updateSelectedInventoryObject = {} } = chatGardenStore;
    this.selectInventoryItem(inventory);
    this.updateInventoryStore('selectedLayoutId', inventory.buildingQualifiedName);

    // Storing additional values for the submission
    chatGardenStore.updateInventory('unitId', inventory.name);
    chatGardenStore.updateInventory('unitQualifiedName', inventory.fullQualifiedName);

    // Set store value for selectedLayoutId
    updateSelectedInventory(inventory.buildingQualifiedName);

    // TODO not ideal, we want to grab the InventoryId instead of this method
    updateSelectedInventoryObject(inventory);

    // STORE HISTORY: Store user responseto proceed to next step
    this.updateStoredHistoryValues({
      voice: strings.USER,
      component: strings.DIALOG,
      text: supplantCopy(this.dialogs.inventoryConversationConsumer, {
        'availableInventory.selectedItem': inventory.fullQualifiedName,
        inventoryPrice: inventory.lowestMonthlyRent,
      }),
    });

    this.props.handleSubmit(null);
    this.props.handleScroll();

    // TODO: This is submitting all the progress to history. SHould be moved out.
    this.props.handlePushHistory(this.storedHistoryValues);

    // TEMP hardcoding these values: clean up later
    const storeFieldInventoryAvailabilityDate = 'inventoryAvailabilityDate';
    chatGardenStore.updateInventory(storeFieldInventoryAvailabilityDate, moment(inventory.availabilityDate).format(YEAR_MONTH_DAY_FORMAT)); // '2021-11-01' early work
    chatLocalStorage.setItem(`reva_chat_${storeFieldInventoryAvailabilityDate}`, moment(inventory.availabilityDate).format(YEAR_MONTH_DAY_FORMAT)); // persist, remove in next iteration
  };

  // Pull Inventory Pricing Matrix
  selectInventoryPricingMatrix = async () => {
    const id = this.inventoryStore.selectedLayoutId || null;
    const webSiteStore = getWebSiteStore();
    const moveInDateValue = this.inventoryStore.moveInDate;
    const inventoryPricingMatrix = await webSiteStore.webSiteService.getInventoryPricing({
      inventoryId: id,
      moveInDate: moveInDateValue,
      propertyId: this.propertyId,
    });
    const inventoryPricingCombinedMatrix = [...inventoryPricingMatrix?.terms, ...inventoryPricingMatrix?.additionalTerms];
    this.updateSelectedInventory(null);
    this.updatePricingMatrix(inventoryPricingCombinedMatrix.sort((a, b) => a.termLength - b.termLength));
    this.props.handleScroll();
  };

  async componentDidMount() {
    const webSiteStore = getWebSiteStore();
    const { currentPropertyStore = {} } = webSiteStore;

    // Handle storing the moveInDate
    const selectedMoveIndate = chatGardenStore.getUserStoreValue('selectedMoveInDate');
    this.updateInventoryStore('moveInDate', selectedMoveIndate);
    chatGardenStore.updateInventory('formatteMoveInDate', `${chatGardenStore.user.selectedMoveInDate}T05:00:00.000Z`);

    // Handle grabbing the consumer dialogs
    this.addConsumerDialogs(this.props.inventoryDialog[0]);

    // constants
    this.updatePropertyId(webSiteStore.currentPropertyId);

    // Retrieve the rental groups
    const inventoryGroups = await currentPropertyStore.marketingLayoutGroups;
    this.updateRoomMatrix(inventoryGroups);
    this.props.handleScroll();
  }

  renderEmptyState = () => {
    const webSiteStore = getWebSiteStore();
    return (
      <div className={cx('emptyStateContainer', 'contentDialog')} data-id="emptyStateContainer">
        <T.Title>{trans('AVAILABILITY_MESSAGE', 'Our availability is limited right now, but things can change fast! Give us a call at:')}</T.Title>
        {webSiteStore?.currentPropertyStore?.phone && (
          <PhoneButton phone={webSiteStore?.currentPropertyStore?.phone} smsEnabled={webSiteStore?.currentPropertyStore?.property?.smsEnabled} />
        )}
      </div>
    );
  };

  render() {
    return (
      <>
        {this.roomMatrix && (
          <>
            {!this.inventoryStore.numOfBedrooms && <ChatSelection buttons={this.roomMatrix} onAddNewDialog={this.selectRoomType} />}
            {!!this.inventoryStore.numOfBedrooms && (
              <>
                <div className={cx('userDialog')}>
                  <Dialog
                    voice="user"
                    text={supplantCopy(this.dialogs.bedCountConversationConsumer, { selectedBedroomCount: this.inventoryStore.numOfBedrooms })}
                  />
                </div>
                {!this.inventoryMatrix.length > 0 && (
                  <div className={cx('botDialog')}>
                    <Avatar imgSrc={TEMP_AVATAR} />
                    <Dialog />
                  </div>
                )}
              </>
            )}
          </>
        )}

        {this.inventoryMatrix.length > 0 && (
          <>
            <div className={cx('botDialog')}>
              <Avatar imgSrc={TEMP_AVATAR} />
              <Dialog
                text={supplantCopy(this.dialogs.layoutConversationContext, {
                  inventoryAvailabilityDate: moment(this.inventoryStore?.moveInDate).format(MONTH_DAY_YEAR_FORMAT),
                  selectedMarketingLayoutGroupBedCount: this.inventoryStore.numOfBedrooms,
                })}
              />
            </div>
            {!this.selectedInventory && <CarouselSelector inventory={this.inventoryMatrix} callback={this.getInventoryLayouts} />}
          </>
        )}

        {!!this.selectedInventory && (
          <>
            <div className={cx('userDialog')}>
              <Dialog voice="user" text={this.dialogs.layoutConversationConsumer} />
            </div>
            <div className={cx('botDialog')}>
              <Avatar imgSrc={TEMP_AVATAR} />
              <Dialog
                text={
                  this.availableUnit?.length > 0
                    ? supplantCopy(this.dialogs.inventoryConversationContext, {
                        selectedMarketingLayout: this.inventoryStore.selectedLayout,
                        selectedMarketingLayoutLowestRent: this.inventoryStore.lowestRent,
                      })
                    : trans(
                        'AVAILABILITY_MESSAGE',
                        'Apologies, we currently do not have any inventory of that type available. But availability changes all the time.',
                      )
                }
              />
            </div>
            {this.availableUnit?.length > 0 ? (
              <AvailableUnits units={this.selectedInventory} selectedInventory={this.selectInventoryOption} />
            ) : (
              this.renderEmptyState()
            )}
          </>
        )}
      </>
    );
  }
}

export default ChatInventory;
