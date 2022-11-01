/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

import classnames from 'classnames/bind';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import uuid from 'uuid/v4';
import Button from '../../../components/Button/Button';
import styles from './ChatGardenWidget.scss';
import { getChatGardenStore } from '../../Stores/ChatGardenStore';

const cx = classnames.bind(styles);

@observer
export default class ChatSelection extends Component {
  render() {
    const { buttons, onAddNewDialog, nextStep, currentStep, webSiteStore } = this.props;
    const chatGardenStore = getChatGardenStore();

    const myButtons =
      buttons &&
      buttons.length > 0 &&
      buttons.map(button =>
        button.displayText ? (
          <Button
            tabIndex="0"
            className={buttons.length === 1 ? cx('mainSelection') : null}
            key={uuid()}
            btnRole={button.primaryButton ? 'primary' : 'secondary'}
            label={button.displayText}
            onClick={() => {
              if (currentStep === 'CollectMoveInDate') {
                webSiteStore.setMoveInTime(button.storeValue);
              }
              if (button.storeField) {
                chatGardenStore.user[button.storeField] = button.displayText;
              }
              // TODO: This is not ideal. For demo. Will request corticon to provide storeField for future releases
              if (currentStep === 'CollectPreferredContactType') {
                chatGardenStore.user.preferredContact = button.displayText;
              }

              return onAddNewDialog(
                button.conversationConsumer,
                button.targetWorkflow || button.targetStep ? { workflow: button.targetWorkflow, nextStep: button.targetStep } : nextStep,
              );
            }}
          />
        ) : null,
      );

    return <div className={cx('cdBody')}>{myButtons}</div>;
  }
}

ChatSelection.propTypes = {
  buttons: PropTypes.any,
  nextStep: PropTypes.string,
  onAddNewDialog: PropTypes.func,
};

ChatSelection.defaultProps = {
  buttons: [],
  nextStep: '',
};
