/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

import classnames from 'classnames/bind';
import React from 'react';
import { inject, observer } from 'mobx-react';
import moment from 'moment-timezone';
import DateTimeSelector from '../../../BookAppointment/DateTimeSelector/DateTimeSelector';
import Avatar from '../../../components/Avatar/Avatar';
import Calendar from '../../../components/Calendar/Calendar';
import Dialog from '../../../components/Dialog/Dialog';
import ChatInputBox from './ChatInputBox';
import styles from './ChatTemplateSelector.scss';
import AvailableUnits from './templates/AvailableUnits';
import botAvatar from './assets/avatar.png';
import Carousel from '../../../components/Carousel/Carousel';
import CarouselSelector from './templates/CarouselSelector';
import ChatInventory from './ChatInventory';
import { InventoryPriceMatrix } from './templates/InventoryPriceMatrix';
import LoadingBlock from '../../../components/LoadingBar/LoadingBlock';
import { BulletsChat } from './templates/Bullets';
import {
  DAY_FORMAT,
  DAY_WEEK_MONTH_FORMAT,
  DATE_US_FORMAT,
  FULL_DATE_FORMAT,
  MONTH_DAY_FORMAT,
  YEAR_MONTH_DAY_FORMAT,
  TIME_FORMAT,
} from '../../helpers/dateConstants';

const cx = classnames.bind(styles);

const chatLocalStorage = window.localStorage;

const TEMP_AVATAR = botAvatar;

const CarouselComponent = props => {
  const { pictures, tours, videos } = props;
  const assets = {
    pictures: pictures || [],
    videos: videos || [],
    tours: tours || [],
  };
  return <Carousel className={cx('carousel')} height={250} {...assets} />;
};

const TemplateSelector = props => {
  const { chat, onAddNewDialog, handleScroll, handlePushHistory, chatGardenStore } = props;
  const component = chat.component;

  const handleSubmit = (value, delString, altResponse) => {
    const deleteFlag = !(delString && delString === 'false');
    return onAddNewDialog(value, chat.submitPath, deleteFlag, chat.storeField || null, altResponse);
  };

  // Calendar Component
  const selectDateTime = value => {
    if (!value) return;

    const responseString = {
      text: `${value.format(DAY_FORMAT)} at ${value.format(TIME_FORMAT)} (${value.format(MONTH_DAY_FORMAT)}) works for me`,
      moment: value,
      storedValue: moment(value).format(FULL_DATE_FORMAT),
    };
    handleSubmit(responseString);
  };

  // Date Picker component
  const handleMoveInDateSelectorChange = ev => {
    if (chat.storeField === 'selectedMoveInDate') {
      // TODO: Need to adjust timezone
      // TODO: These need to be updated on next revision. Temp, and consider moving to a helper function
      // TODO: Use constants for the DATE/TIME -> see dateConstants.js
      chatGardenStore.updateInventory('selectedTourDateTime', `${moment(ev).format(DATE_US_FORMAT)} 00:00:00 GMT`);
      chatLocalStorage.setItem('reva_chat_selectedTourDateTime', `${moment(ev).format(DATE_US_FORMAT)} 00:00:00 GMT`);
    }

    handleSubmit(moment(ev).format(YEAR_MONTH_DAY_FORMAT), false, `I plan to move on ${moment(ev).format(DAY_WEEK_MONTH_FORMAT)}.`);
  };
  const renderMoveInDate = () => {
    const { moveInDate, minMoveInDate, currentPropertyStore = {} } = props.webSiteStore;
    const { timezone } = currentPropertyStore;

    return (
      <div className={cx('moveInDate')} data-id="inventoryDateSelector">
        <Calendar tz={timezone} onChange={ev => handleMoveInDateSelectorChange(ev)} selectedDate={moveInDate} min={minMoveInDate} />
      </div>
    );
  };

  // Carousel component
  // Temp for now - this is only handling the case for Inventory Section
  const inventory = chatGardenStore?.inventoryObject;
  const selectInventoryPricingMatrix = () => {};
  const propertyInfo = props.webSiteStore?.currentPropertyStore;

  let chatComponent;
  let carouselComponentElement;
  switch (component) {
    case 'chatHistoryDivider':
      chatComponent = <div className={cx('divider')} />;
      break;

    case 'dialog':
      if (chat.voice === 'bot') {
        if (!chat.text?.length >= 1) {
          // Add a return to start button here...
        }
        chatComponent = (
          <div className={cx('botDialog')}>
            <Avatar imgSrc={TEMP_AVATAR} />
            <Dialog text={chat.text} />
          </div>
        );
      } else {
        chatComponent = (
          <div className={cx('userDialog')}>
            <Dialog voice="user" text={chat.text} />
          </div>
        );
      }
      break;

    case 'loader':
      chatComponent = (
        <div className={cx('botDialog')}>
          <Avatar imgSrc={TEMP_AVATAR} />
          <div className={cx('botLoading')}>
            <LoadingBlock />
          </div>
        </div>
      );
      break;

    case 'input':
      chatComponent = (
        <div className={cx('textBox')}>
          <ChatInputBox chat={chat} handleSubmit={ev => handleSubmit(ev)} type="email" />
        </div>
      );
      break;

    case 'widget':
      chatComponent = (
        <div className={cx('textBox')}>
          <p>I am a widget!</p>
        </div>
      );
      break;

    case 'bullet':
      chatComponent = <BulletsChat bullets={props.chat.bullet} />;
      break;

    case 'calendar':
      if (chat.type === 'datePicker') {
        chatComponent = renderMoveInDate();
      } else {
        chatComponent = <DateTimeSelector onSelect={value => selectDateTime(value)} />;
      }
      break;

    case 'carousel':
      switch (chat.apiCall) {
        case 'property.getVideos':
          carouselComponentElement = (
            <CarouselComponent
              videos={propertyInfo.propertyRq?.response?.videoUrls.map(vid => ({
                source: vid.url,
              }))}
            />
          );
          break;
        case 'property.getPhotos':
          carouselComponentElement = (
            <CarouselComponent
              pictures={propertyInfo.propertyRq?.response?.images.map(pic => ({
                alt: pic.caption,
                source: pic.url,
              }))}
            />
          );
          break;
        case 'property.get3DTour':
          carouselComponentElement = (
            <CarouselComponent
              text={chat.text}
              tours={propertyInfo.propertyRq?.response['3DUrls'].map(tour => ({
                source: tour.url,
              }))}
            />
          );
          break;
        default:
          carouselComponentElement = <CarouselSelector imageUrls={inventory.imageUrls} mode="standard" callback={() => selectInventoryPricingMatrix()} />;
      }
      chatComponent = [carouselComponentElement];
      break;

    case 'inventory':
      chatComponent = <AvailableUnits />;
      break;

    case 'inventoryPicker':
      chatComponent = (
        <ChatInventory
          {...chat}
          {...onAddNewDialog}
          handleSubmit={ev => handleSubmit(ev)}
          handleScroll={() => handleScroll()}
          handlePushHistory={handlePushHistory}
        />
      );
      break;

    case 'leaseTermMatrix':
      chatComponent = (
        <InventoryPriceMatrix
          handleSubmit={(value, selLeaseTerm, altResponse) => {
            onAddNewDialog(value, 'CollectFullName', true, 'selectedMarketingLayoutLowestRent', altResponse);
          }}
        />
      );
      break;

    default:
      chatComponent = <Dialog voice="user" text="No matched component" />;
  }

  return chatComponent;
};

export default inject('webSiteStore', 'chatGardenStore')(observer(TemplateSelector));
