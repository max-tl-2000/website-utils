/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

import React, { Component } from 'react';
import { action } from 'mobx';
import { observer, inject } from 'mobx-react';
import classnames from 'classnames/bind';
import debounce from 'debouncy';
import * as W from '../../components/Wizard/Wizard';
import { trans } from '../../common/trans';
import DateTimeSelector from '../DateTimeSelector/DateTimeSelector';
import ContactInfoForm from '../ContactInfoForm/ContactInfoForm';
import ThankYouCard from '../ThankYouCard/ThankYouCard';
import Button from '../../components/Button/Button';
import LightButton from '../../Website/Components/LightButton/LightButton';
import UserActivityWarning from '../../Website/Containers/UserActivity/UserActivityWarning';
import styles from './AppointmentCreate.scss';
import { Events, Categories, Components, SubContexts } from '../../Website/helpers/tracking-helper';

const cx = classnames.bind(styles);

const THRESHOLD_TO_PERFORM_BOOKING = 300;

@inject('appointmentCreateModel', 'webSiteStore')
@observer
export default class AppointmentCreate extends Component {
  @action
  selectDateTime = dateTime => {
    const { appointmentCreateModel: acm } = this.props;
    acm.selectAppointmentDateTime(dateTime);
  };

  closeDialog = () => {
    const { appointmentCreateModel: acm, closeDialog } = this.props;
    acm.moveToBeginning();
    !!closeDialog && closeDialog();
  };

  @action
  performBooking = async () => {
    const { appointmentCreateModel: acm, webSiteStore } = this.props;
    const { contactFormModel } = acm;

    await contactFormModel.validate();

    if (contactFormModel.valid) {
      const success = await acm.saveAppointment(contactFormModel.serializedData);

      if (webSiteStore && success) {
        webSiteStore.enableTrackUserActivity(true);
        webSiteStore.notifyEvent(Events.WEB_INQUIRY, {
          eventLabel: 'appointment',
          category: Categories.USER_ACTION,
          component: Components.APPOINTMENT_CREATE,
          subContext: SubContexts.BOOK_APPOINTMENT,
        });
      }
    }
  };

  doPerformBooking = debounce(() => {
    this.performBooking();
  }, THRESHOLD_TO_PERFORM_BOOKING);

  @action
  goPrevStep = () => {
    const { appointmentCreateModel: acm } = this.props;
    const { contactFormModel } = acm;
    const formData = contactFormModel.serializedData;
    contactFormModel.restoreInitialValues();
    acm.movePrev(formData);
  };

  getTitle = (propertyName, buildingQualifiedName) => {
    if (buildingQualifiedName) {
      return trans('SCHEDULE_A_TOUR_FOR_APARTMENT', 'Schedule a tour for apartment {{buildingQualifiedName}}', { buildingQualifiedName });
    }

    if (propertyName) {
      return trans('SCHEDULE_A_TOUR_FOR_PROPERTY', 'Schedule a tour for {{propertyName}}', { propertyName });
    }

    return trans('BOOK_A_TOUR', 'Book a tour');
  };

  render() {
    const { appointmentCreateModel: acm, onBack, propertyName, buildingQualifiedName, useCustomizedStyle, matches } = this.props;
    const step1Title = this.getTitle(propertyName, buildingQualifiedName);
    const step1SubTitle = trans('BOOK_A_TOUR_SUBTITLE', 'If you are ready to view your future home, please select a date and time to schedule a tour below.');

    const step2Title = trans('PROVIDE_CONTACT_INFO', 'Provide contact information');
    const step2SubTitle = trans('PROVIDE_CONTACT_SUB', "Enter your contact information below, and we'll be in touch with you shortly.");

    const backLabel = trans('BACK', 'back');
    const confirmApptmntLabel = matches?.small1
      ? trans('CONFIRM_APPOINTMENT', 'Confirm your appointment')
      : trans('CONFIRM_APPOINTMENT_SHORT', 'Confirm appointment');

    return (
      <W.Wizard index={acm.wizardIndex}>
        <W.Step compact={!matches?.small2} title={step1Title} subTitle={step1SubTitle} container={false} useCustomizedStyle>
          <DateTimeSelector compact={!matches?.small2} onSelect={this.selectDateTime} useCustomizedStyle={useCustomizedStyle} />
          {!!onBack && (
            <div className={cx('dateTimeSelectorFooter')} data-id="dateTimeSelectorFooter">
              <LightButton type="flat" btnRole="secondary" label={backLabel} onClick={() => onBack()} />
            </div>
          )}
        </W.Step>
        <W.Step compact={!matches?.small2} title={step2Title} subTitle={step2SubTitle} container={false} useCustomizedStyle>
          <UserActivityWarning className={cx('user-activity-warning')} />
          <ContactInfoForm compact={!matches?.small2} acm={acm} />
          <div className={cx('dateTimeSelectorFooter')} data-id="contactInfoFooter">
            <LightButton onClick={this.goPrevStep} type="flat" btnRole="secondary" label={backLabel} disabled={acm.savingAppointment} />
            <LightButton
              type="flat"
              btnRole="primary"
              label={confirmApptmntLabel}
              onClick={this.doPerformBooking}
              disabled={acm.savingAppointment || acm.showDuplicateApptError}
            />
          </div>
        </W.Step>
        <W.Step className={cx('lastStep')}>
          <ThankYouCard />
          <Button
            onClick={this.closeDialog}
            className={cx('continueButton')}
            type="raised"
            btnRole="primary"
            label={trans('CONTINUE_EXPLORING', 'Continue exploring your community')}
          />
        </W.Step>
      </W.Wizard>
    );
  }
}
