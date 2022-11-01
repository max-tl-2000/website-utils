/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

import { action, observable } from 'mobx';
import { observer } from 'mobx-react';
import React, { Component } from 'react';
import IconButton from '../../../components/IconButton/IconButton';
import * as Assets from './chatAssets';

// @action
// clearHistory = () => {
//   this.props.chatGardenStore.updateChatHistory([]);
//   localStorage.setItem('reva_chat_history', []);
//   this.loadIntroChat();
// };

@observer
export default class ClearChatHistoryBtn extends Component {
  @action onClearHistory = () => {
    this.props.action();
  };

  @observable isClearingSuccess = false;

  render() {
    return <IconButton style={{ position: 'absolute', right: 48, background: 'transparent' }} icon={Assets.History} onClick={() => this.onClearHistory()} />;
  }
}
