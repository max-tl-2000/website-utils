/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { observable, action } from 'mobx';
import classnames from 'classnames/bind';
import * as W from '../components/Wizard/Wizard';
import * as T from '../components/Typography/Typopgraphy';
import SimpleDialog from '../components/SimpleDialog/SimpleDialog';
import { DialogModel } from '../common/DialogModel';
import { trans } from '../common/trans';
import ContactForm from './ContactForm';
import ThankYouCard from '../BookAppointment/ThankYouCard/ThankYouCard';
import styles from './ContactFormDialog.scss';
import ThankYouImage from '../resources/svgs/inbox.svg';
import EnvelopeIcon from '../resources/svgs/EnvelopeIcon.svg';
import IconButton from '../components/IconButton/IconButton';
import Button from '../components/Button/Button';
import PhoneButton from '../Website/Components/PhoneButton/PhoneButton';
import UserActivityWarning from '../Website/Containers/UserActivity/UserActivityWarning';
import { SubContexts, Categories, Components, Events } from '../Website/helpers/tracking-helper';

const cx = classnames.bind(styles);

@inject('webSiteStore')
@observer
export class ContactFormDlg extends Component {
  @observable
  wizardIndex = 0;

  @action
  moveToThankYouStep = () => {
    const { webSiteStore } = this.props;
    if (webSiteStore) {
      webSiteStore.enableTrackUserActivity(true);
      webSiteStore.notifyEvent(Events.WEB_INQUIRY, {
        eventLabel: 'contact',
        category: Categories.USER_ACTION,
        component: Components.CONTACT_US_DIALOG,
      });
    }
    this.wizardIndex = 1;
  };

  @action
  moveToContactUsStep = () => {
    this.wizardIndex = 0;
  };

  handleCloseDialog = () => {
    this.moveToContactUsStep();
    const { onCloseRequest } = this.props;
    onCloseRequest && onCloseRequest();
  };

  renderContactFormTitle = (phone, screenSizeStore = {}, smsEnabled) => (
    <div className={cx('contactFormHeader', { small1: screenSizeStore.matchSmall1 })}>
      <T.Header noMargin={screenSizeStore.matchSmall1} className={cx('bigTitle', 'serifFont')}>
        {trans('CONTACT_US_TITLE', 'Contact Us')}
      </T.Header>
      {phone && <PhoneButton subContext={SubContexts.CONTACT_US_DIALOG} {...{ phone, smsEnabled }} />}
    </div>
  );

  render() {
    const { wizardIndex, props } = this;
    const { open, phone, smsEnabled, showCloseAction, webSiteStore } = props;
    const thankYouSubTitle1 = trans('THANK_YOU_FOR_CONTACTING_US', 'Thank you for contacting us');
    const thankYouSubTitle2 = trans('WE_WILL_GET_BACK', "We'll have someone get back to you soon");
    const lblClose = trans('CLOSE', 'Close');

    const { screenSizeStore = {} } = webSiteStore || {};

    return (
      <SimpleDialog
        showCloseAction={showCloseAction}
        closeOnEscape
        open={open}
        onCloseRequest={this.handleCloseDialog}
        renderButton={false}
        dataId="contactUsDialogContainer">
        <W.Wizard className={styles.mainContainer} index={wizardIndex}>
          <W.Step container={false}>
            {this.renderContactFormTitle(phone, screenSizeStore, smsEnabled)}
            <UserActivityWarning />
            <ContactForm
              compact={!screenSizeStore.matchSmall1}
              onSubmit={this.moveToThankYouStep}
              className={cx({ hasWarnig: !webSiteStore?.trackUserActivityEnabled })}
              fullWidth
            />
          </W.Step>
          <W.Step container={false}>
            <div className={cx('thankYouContent', { small1: screenSizeStore.matchSmall2 })}>
              <ThankYouCard
                thankYouSubTitle1={thankYouSubTitle1}
                thankYouSubTitle2={thankYouSubTitle2}
                thankYouImage={<ThankYouImage className={cx('thankYouImage')} />}
              />
              <Button className={cx('btnClose', { hide: showCloseAction })} btnRole="primary" label={lblClose} onClick={this.handleCloseDialog} />
            </div>
          </W.Step>
        </W.Wizard>
      </SimpleDialog>
    );
  }
}

@inject(({ webSiteStore }) => {
  const { screenSizeStore } = webSiteStore || {};
  return {
    screenSizeStore,
  };
})
@observer
export default class ContactFormDialog extends Component {
  constructor(props) {
    super(props);
    this.dlg = new DialogModel();
  }

  @action
  handleOpen = () => {
    this.dlg.open();
  };

  @action
  handleCloseRequest = () => {
    this.dlg.close();
  };

  render() {
    const { dlg, props } = this;
    const { phone = '763-225-2675', smsEnabled } = props;
    const { screenSizeStore } = props;
    return (
      <>
        <IconButton icon={EnvelopeIcon} iconOnLeft type="flat" label={trans('CONTACT_US', 'Contact us')} onClick={this.handleOpen} />
        <ContactFormDlg showCloseAction={!screenSizeStore.matchSmall2} open={dlg.isOpen} onCloseRequest={this.handleCloseRequest} {...{ phone, smsEnabled }} />
      </>
    );
  }
}
