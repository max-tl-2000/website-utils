/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

'use strict';

import classnames from 'classnames/bind';
import { action, computed, observable } from 'mobx';
import { inject, observer } from 'mobx-react';
import React, { Component } from 'react';
import uuid from 'uuid/v4';
import Button from '../../../components/Button/Button';
import IconButton from '../../../components/IconButton/IconButton';
import {
  buildChatPayload,
  createChatGardenService,
  formatResponseWithComponents,
  handleSubmitAction,
  handleChatTrackingEvent,
} from '../../../Services/chatGardenService';
import { Categories, Components, Events, SubContexts } from '../../helpers/tracking-helper';
import * as Assets from './chatAssets';
import styles from './ChatGardenWidget.scss';
import ChatMain from './ChatMain';
import ChatSelection from './ChatSelection';
import TemplateSelector from './ChatTemplateSelector';
import { qs } from '../../../common/dom';

const cx = classnames.bind(styles);
const chatLocalStorage = window.localStorage;

const strings = {
  USER: 'user',
  BOT: 'bot',
  DIALOG: 'dialog',
  SPECIALS: "The summer is hot and here and we have the coolest apartment homes for you! Book your tour before they're gone!",
};

let chatArray;
let chatObject;

let propertyId;

const MAX_HISTORY_LENGTH = 100;

const CHAT_WINDOW_MIN_HEIGHT = 640;

const html = qs('html');

// TODO: consider moving this out to the store
const componentTypes = ['bullet', 'calendar', 'carousel', 'inventory', 'inventoryPicker', 'leaseTermMatrix'];

@inject(({ webSiteStore, chatGardenStore, appointmentCreateModel }) => ({
  webSiteStore,
  chatGardenStore,
  appointmentCreateModel,
}))
@observer
export default class ChatGardenWidget extends Component {
  @observable
  nextStep = null;

  @observable
  chatIsActive = false;

  @observable
  chatIsLoading = false;

  @observable
  chatOptions = [];

  @observable
  tertiaryBtn = null;

  @observable
  specials = null;

  @observable
  selectedStep = null;

  @observable
  propertyStore = {};

  @observable
  propertyName = {};

  @action
  updateSelectedStep = value => {
    this.selectedStep = value;
  };

  @action
  updateNextStep = value => {
    this.nextStep = value;
  };

  windowResizeFn = () => {
    html.setAttribute('chat-bot-max-size', window.innerHeight < CHAT_WINDOW_MIN_HEIGHT);
  };

  @action
  updateChatIsActive = value => {
    value ? html.setAttribute('chat-bot-is-open', true) : html.removeAttribute('chat-bot-is-open', false);
    // Handle applying hidden to overflow
    document.querySelector('body').style.overflow = value ? 'hidden' : 'auto';
    this.chatIsActive = value;
    // Handle resize event to expand to max size on small viewport
    this.windowResizeFn();
    this.chatIsActive ? window.addEventListener('resize', this.windowResizeFn) : window.removeEventListener('resize', this.windowResizeFn);
  };

  @action
  updateChatIsLoading = value => {
    this.chatIsLoading = value;
  };

  @action
  updateChatOptions = value => {
    this.chatOptions = value;
  };

  @action
  updateTertiaryBtn = value => {
    this.tertiaryBtn = value;
  };

  @action
  updateSpecials = (value, reset) => {
    if (reset) this.specials = null;
    if (!value) return;
    this.specials = strings.SPECIALS;
  };

  @action
  returnChatBotTrackerObject = () => ({
    currentStep: this.nextStep || 'home',
    workflowDepth: 0,
    interactionCount: this.props.chatGardenStore.chatHistory.length,
    propertySpecials: !!this.propertyStore.specials,
  });

  @action
  trackChatClick = (propertyName, userAction) => {
    const eventActionLabel = userAction;
    handleChatTrackingEvent(this.props.webSiteStore, 'notifyEvent', {
      propertyName,
      returnChatBotTrackerObject: this.returnChatBotTrackerObject,
      eventActionLabel,
    });
  };

  @action
  trackChatContact = () => {
    this.props.webSiteStore.notifyEvent(Events.WEB_INQUIRY, {
      eventLabel: 'contact',
      chatbot: this.returnChatBotTrackerObject,
      category: Categories.USER_ACTION_WEBCHAT,
      component: Components.CONTACT_US,
      subContexts: SubContexts.WEBCHAT,
    });
  };

  @computed
  get propertyStoreDetails() {
    const { webSiteStore } = this.props;
    const { currentPropertyStore = {} } = webSiteStore;
    return currentPropertyStore;
  }

  @computed
  get layoutStore() {
    const { webSiteStore } = this.props;
    const { currentPropertyStore = {} } = webSiteStore;
    return currentPropertyStore?.layoutStore;
  }

  handlePushHistory = historyArray => {
    const { chatGardenStore } = this.props;
    chatArray = [...chatGardenStore?.chatHistory, ...historyArray];
    this.updateChatHistory(chatArray);
  };

  updateChatHistory = chat => {
    this.props.chatGardenStore.updateChatHistory(chat);
    const chatToSave = JSON.stringify(chat.slice(-MAX_HISTORY_LENGTH));
    chat && localStorage.setItem('reva_chat_history', chatToSave);
  };

  retrievePropertyInfo = () => {
    const { webSiteStore, chatGardenStore } = this.props;
    const property = webSiteStore.currentPropertyStore?.property;
    chatGardenStore.updateProperty(property?.displayName);
    propertyId = webSiteStore?.currentPropertyId;
    return property?.displayName;
  };

  async launchChatGarden() {
    this.propertyName = this.retrievePropertyInfo();
    this.updateChatIsActive(true);
    this.trackChatClick(this.propertyName, Events.WEBCHAT_OPEN);
    setTimeout(() => {
      this.scrollToBottom();
    }, 100);
  }

  closeChatGarden() {
    this.updateChatIsActive(false);
    this.trackChatClick(this.propertyName, Events.WEBCHAT_CLOSE);
  }

  async retrieveChat(step) {
    this.updateChatIsLoading(true);
    const { chatGardenStore, webSiteStore } = this.props;

    const payload = buildChatPayload(chatGardenStore, step, webSiteStore?.currentPropertyStore?.propertyRq?.response);
    const chatService = createChatGardenService(payload);
    const response = await chatService.retrieveNextStep();
    this.updateChatIsLoading(false);

    // Reset specials
    this.updateSpecials(null, true);

    const formattedResponse = formatResponseWithComponents(response.Objects[0].step, response.Objects[0].currentStep, response.Objects[0].workflowName);

    return formattedResponse;
  }

  returnTextValue(response) {
    const isObject = typeof response === 'object' && response !== null;
    if (isObject) return response.text;
    return response;
  }

  validateIsKnownComponent = componentType => componentTypes.includes(componentType);

  @observable
  onAddNewDialog = async (response, path, deleteFlag, storeField, altResponse) => {
    const { chatGardenStore } = this.props;
    const obsoleteComponents = ['bullet', 'carousel'];

    chatArray = [
      ...chatGardenStore?.chatHistory
        ?.filter(
          // Filter is removing rogue components from previous chat
          chat => !obsoleteComponents.includes(chat.component),
        )
        .map(chat => chat),
    ];

    if (storeField && response) {
      chatGardenStore.updateUser(storeField, response); // early work
      chatLocalStorage.setItem(`reva_chat_${storeField}`, response); // persist, remove in next iteration
    }

    if (deleteFlag) {
      chatArray.pop();
    }

    // TODO: Temp hack fix as the carousel slider is not set as part of button
    if (path === 'GenerateQuoteMatrix') chatArray.pop();

    // User dialog input here
    if (response) {
      chatObject = {
        voice: strings.USER,
        component: strings.DIALOG,
        text: this.returnTextValue(altResponse || response),
      };
      chatArray.push(chatObject);
    }

    this.updateChatHistory(chatArray);

    let responseFromChat = await this.retrieveChat(path);

    if (responseFromChat.skipClientCallback) {
      responseFromChat = await this.retrieveChat(responseFromChat.nextStep, responseFromChat);
    }

    if (responseFromChat.nextStep === null) {
      return;
    }

    // Look for APICall
    if (responseFromChat.action) {
      const actionApi = responseFromChat?.action[0]?.name;
      const { appointmentCreateModel: acm } = this.props;
      if (!actionApi) return;
      const apiResponse = await handleSubmitAction(chatGardenStore, actionApi, acm, propertyId);

      if (apiResponse.httpStatusCode !== 200 && apiResponse.httpStatusCode !== 202) {
        chatObject = {
          voice: strings.BOT,
          component: strings.DIALOG,
          text: 'Apologies, something has gone wrong with your request.',
        };
        chatArray.push(chatObject);
        this.updateChatHistory(chatArray);

        // This is repetitive from below, needs some reconfiguring.
        this.updateChatOptions(responseFromChat.button || null);
        this.updateSelectedStep(responseFromChat.currentStep);
        this.updateNextStep(responseFromChat.nextStep);
        this.scrollToBottom();

        return;
      }
    }

    chatObject = {
      voice: strings.BOT,
      component: strings.DIALOG,
      text: responseFromChat.conversationContext,
      nextStep: this.nextStep,
    };
    chatArray.push(chatObject);

    // TODO: HACK HACK HACK Fix: Quote Matrix is outside step. Until this is corrected, adding a step here
    if (responseFromChat.currentStep === 'SelectLeaseTerm') {
      chatObject = {
        voice: null,
        component: 'leaseTermMatrix',
        text: null,
        nextStep: responseFromChat.nextStep,
      };
      chatArray.push(chatObject);
    }

    let componentType;

    if (responseFromChat.components?.length > 0) {
      for (let i = 0; i < responseFromChat.components.length; i++) {
        componentType = Object.keys(responseFromChat.components[i])[0];
        if (componentType === 'textBox') {
          const textBoxResponse = responseFromChat.components[i].textBox;
          chatObject = {
            voice: strings.BOT,
            component: 'input',
            order: textBoxResponse.order,
            submitApiCall: (textBoxResponse.button && textBoxResponse.button[0]?.aPICall) || null,
            inputProperties: {
              helperText: textBoxResponse.emptyText,
              value: textBoxResponse.storeField,
              storeField: textBoxResponse.storeField,
              style: textBoxResponse.style,
              singleLine: !textBoxResponse.multiline,
              isRequired: textBoxResponse.isRequired,
            },
            submitPath: responseFromChat.nextStep,
          };
          if (responseFromChat.components[i].textBox.storeField) {
            chatObject.storeField = responseFromChat.components[i].textBox.storeField;
          }
          chatArray.push(chatObject);
        } else if (this.validateIsKnownComponent(componentType)) {
          chatObject = {
            voice: strings.BOT,
            component: componentType,
            submitPath: responseFromChat.nextStep,
            storeField: responseFromChat?.components[i]?.[componentType]?.storeValue || responseFromChat?.components[i]?.[componentType]?.storeField,
            type: responseFromChat?.components[i]?.[componentType]?.type,
          };

          // TODO: This needs to be cleaner
          const componentApiCall = responseFromChat?.components[i][componentType]?.action;
          const componentAction = componentApiCall && componentApiCall[0]?.name;
          if (componentAction) {
            chatObject.apiCall = componentAction;
          }

          if (chatObject.component === 'inventoryPicker') {
            chatObject.inventoryDialog = responseFromChat.inventoryPicker;
          }

          if (chatObject.component === 'bullet') {
            chatObject.bullet = responseFromChat.bullet;
          }
          chatArray.push(chatObject);
        } else {
          throw Error('No matching component');
        }
      }
    }

    if (responseFromChat.widget) {
      chatObject = {
        voice: strings.BOT,
        component: 'widget',
      };
      chatArray.push(chatObject);
    }

    if (responseFromChat?.component === 'leaseTermMatrix') {
      chatObject = {
        voice: strings.BOT,
        component: 'leaseTermMatrix',
      };
      chatArray.push(chatObject);
    }

    this.updateChatHistory(chatArray);
    this.updateChatOptions(responseFromChat.button || null);
    this.updateSelectedStep(responseFromChat.currentStep);
    this.updateNextStep(responseFromChat.nextStep);
    this.updateTertiaryBtn(responseFromChat.tertiaryButton ? responseFromChat.tertiaryButton[0] : null);

    // Below is TEMP only, should now be looking for step string
    this.updateSpecials(responseFromChat.currentStep && responseFromChat.currentStep === 'ShowMarketingSpecials' ? responseFromChat.currentStep : null);
    this.scrollToBottom();
  };

  scrollToBottom = () => this.chatDialogContainter?.scrollIntoView({ behavior: 'smooth' });

  removeIntroChats(chatHistory) {
    const obsoleteIntroComponents = ['input', 'calendar', 'inventoryPicker', 'bullet', 'carousel'];
    return chatHistory.filter(chat => chat.isIntro !== true && !obsoleteIntroComponents.includes(chat.component)).map(chat => chat);
  }

  async loadIntroChat() {
    const { chatGardenStore, webSiteStore } = this.props;
    const { currentPropertyStore: propertyStore = {} } = webSiteStore;
    const { property = {} } = propertyStore;
    this.propertyStore = property;

    // INIT welcome state
    const initState = await this.retrieveChat();

    chatObject = {
      voice: strings.BOT,
      component: strings.DIALOG,
      text: initState?.conversationContext,
      isIntro: true,
    };

    chatArray = [...chatGardenStore.chatHistory];
    chatArray.push(chatObject);

    // TEMP
    this.updateChatOptions(initState?.button);
    this.updateChatHistory(chatArray);
    this.updateTertiaryBtn(initState.enableTertiaryButton ? initState.tertiaryButton[0] : null);
  }

  componentDidMount() {
    const history = JSON.parse(localStorage.getItem('reva_chat_history'));
    const filteredHistory = history?.length > 0 ? this.removeIntroChats(history) : [];
    const revaChatLength = filteredHistory.length;
    if (revaChatLength > 0) {
      chatObject = {
        component: 'chatHistoryDivider',
        isIntro: true,
      };
      filteredHistory.push(chatObject);
    }
    this.props.chatGardenStore.updateChatHistory(filteredHistory);
    this.loadIntroChat();
  }

  render() {
    // All this needs ot be moved out, causing refreshing unnecessarily
    const children = [];
    const { chatGardenStore, webSiteStore } = this.props;

    chatGardenStore.chatHistory.map((chat, index) =>
      children.push(
        <TemplateSelector
          key={uuid()}
          number={index}
          chat={chat}
          onAddNewDialog={this.onAddNewDialog}
          propertyId={propertyId}
          handleScroll={() => this.scrollToBottom()}
          handlePushHistory={this.handlePushHistory}
        />,
      ),
    );

    // There needs to be a check made when an input box is present as well, button should also dismiss the input field
    const hasInputComponent = chatGardenStore.chatHistory[chatGardenStore.chatHistory.length - 1]?.component === 'input';

    return [
      this.chatIsActive && (
        <>
          <div className={cx('chatDialog')} key="div">
            <div className={cx('cdHeader')}>
              <IconButton className={cx('dialogButtons')} type="flat" icon={Assets.ChatBubble} />
              <span>{chatGardenStore.propertyName}</span>
              <span className={cx('close')}>
                <IconButton icon={Assets.Minimize} className={cx('minimizeChatDialog', 'dialogButtons')} type="flat" onClick={() => this.closeChatGarden()} />
              </span>
            </div>

            <ChatMain addChild={this.onAddChild}>{children}</ChatMain>

            {this.specials && (
              <div className={cx('chatSpecials')}>
                <span>Specials:</span> {this.specials}
              </div>
            )}

            <ChatSelection
              webSiteStore={webSiteStore}
              addChild={this.onAddChild}
              buttons={this.chatOptions}
              nextStep={this.nextStep}
              currentStep={this.selectedStep}
              onAddNewDialog={this.onAddNewDialog}
              retrieveChat={this.retrieveChat}
              hasInputValue={hasInputComponent}
            />

            {this.chatIsLoading && <TemplateSelector chat={{ component: 'loader', voice: strings.BOT }} />}

            {!this.specials && this.tertiaryBtn && (
              <div className={cx('cdBody')}>
                <div className={cx('divider')} />
                <Button
                  className={cx('fullWidth')}
                  btnRole="secondary"
                  type="outline"
                  onClick={() => this.onAddNewDialog(null, this.tertiaryBtn.targetStep, true)}
                  label={this.tertiaryBtn.displayText}
                />
              </div>
            )}
            <div
              ref={el => {
                this.chatDialogContainter = el;
              }}
            />
          </div>
          <div className={cx('chatDialogBg')} onClick={() => this.closeChatGarden()} />
        </>
      ),
      <IconButton key="iconButton" className={cx('ChatGardenWidget')} icon={Assets.ChatBubbleLoading} onClick={() => this.launchChatGarden()} />,
    ];
  }
}
