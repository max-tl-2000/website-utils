/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

import React, { Component } from 'react';
import { observable, action, computed } from 'mobx';
import { observer, inject } from 'mobx-react';
import classNames from 'classnames/bind';
import SimpleDialog from '../../../components/SimpleDialog/SimpleDialog';
import BookerWidget from '../BookerWidget/BookerWidget';
import Button from '../../../components/Button/Button';
import styles from './ScheduleTourWidget.scss';
const cx = classNames.bind(styles);

@inject('appointmentCreateModel', 'webSiteStore')
@observer
export default class ScheduleTourWidget extends Component {
  @observable
  isOpen = false;

  @action
  openDialog = value => {
    const { appointmentCreateModel } = this.props;
    appointmentCreateModel && appointmentCreateModel.moveToBeginning();
    this.isOpen = value;
  };

  @computed
  get propertyStore() {
    const { webSiteStore } = this.props;
    const { currentPropertyStore = {} } = webSiteStore;
    return currentPropertyStore;
  }

  @computed
  get screenSizeStore() {
    const { webSiteStore } = this.props;
    return webSiteStore.screenSizeStore;
  }

  render() {
    const { markupData } = this.props;
    const { property } = this.propertyStore;

    const { enableScheduleTour } = property || {};

    const { isOpen } = this;
    return (
      <>
        {enableScheduleTour && <Button type="flat" flat-version="2" data-selected={false} {...markupData} onClick={() => this.openDialog(true)} />}
        {isOpen && (
          <SimpleDialog
            dlgBodyClassName={cx('dialog', { fixedWidth: this.screenSizeStore.matchMedium })}
            onCloseRequest={() => this.openDialog(false)}
            open={isOpen}
            showCloseAction
            closeOnEscape
            renderButton={false}>
            <BookerWidget {...this.props} closeDialog={() => this.openDialog(false)} />
          </SimpleDialog>
        )}
      </>
    );
  }
}

@inject('appointmentCreateModel', 'webSiteStore')
@observer
export class ScheduleTourDialog extends Component {
  @computed
  get propertyStore() {
    const { webSiteStore } = this.props;
    const { currentPropertyStore = {} } = webSiteStore;
    return currentPropertyStore;
  }

  @computed
  get screenSizeStore() {
    const { webSiteStore } = this.props;
    return webSiteStore.screenSizeStore;
  }

  @action
  resetState = () => {
    const { appointmentCreateModel } = this.props;
    appointmentCreateModel && appointmentCreateModel.moveToBeginning();
  };

  render() {
    const { property } = this.propertyStore;

    const { enableScheduleTour } = property || {};

    const { dlgModel } = this.props;
    return (
      <SimpleDialog
        dlgBodyClassName={cx('dialog', { fixedWidth: this.screenSizeStore.matchMedium })}
        onEnterStart={this.resetState}
        onCloseRequest={dlgModel.close}
        open={dlgModel.isOpen}
        showCloseAction
        closeOnEscape
        renderButton={false}>
        {enableScheduleTour ? <BookerWidget {...this.props} closeDialog={dlgModel.close} /> : 'Scheduler widget not enabled for property'}
      </SimpleDialog>
    );
  }
}
