/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { action } from 'mobx';
import Button from '../../../components/Button/Button';
import DynamicFormDialog from './DynamicFormDialog';
import { MessageDialogModel } from './MessageDialogModel';

@inject(({ webSiteStore }) => ({
  messageFormStore: webSiteStore.genericMessageFormStore,
  properties: webSiteStore.properties,
  screen: webSiteStore.screenSizeStore,
}))
@observer
export default class DynamicFormDialogWrapper extends Component {
  constructor(props) {
    super(props);
    this.dlg = new MessageDialogModel();
  }

  @action
  handleOpen = () => {
    this.dlg.open();
  };

  @action
  handleCloseRequest = () => {
    this.dlg.close();
  };

  @action
  handleClosed = () => {
    this.props.messageFormStore.clearError();
    this.dlg.setWizardIndex(0);
  };

  render() {
    const { dlg, props } = this;
    const { fields, formId, translations = {}, messageFormStore, properties, transformPayload, screen } = props;

    return (
      <>
        <Button big type="raised" label={translations.triggerLabel} onClick={this.handleOpen} />
        <DynamicFormDialog
          formId={formId}
          fields={fields}
          isOpen={dlg.isOpen}
          wizardIndex={dlg.wizardIndex || 0}
          onCloseRequest={this.handleCloseRequest}
          onClosed={this.handleClosed}
          translations={translations}
          properties={properties}
          dlg={this.dlg}
          screen={screen}
          model={messageFormStore}
          transformPayload={transformPayload}
        />
      </>
    );
  }
}
