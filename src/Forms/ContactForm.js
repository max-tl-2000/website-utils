/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

import React, { Component } from 'react';
import { observer, inject, Observer } from 'mobx-react';
import { computed, action, observable } from 'mobx';
import classNames from 'classnames/bind';

import TextBox from '../components/TextBox/TextBox';
import Dropdown from '../components/Dropdown/Dropdown';
import * as T from '../components/Typography/Typopgraphy';
import LoadingBlock from '../components/LoadingBar/LoadingBlock';
import { FormField, NON_VISIBLE_FIELD } from '../common/FormField';
import * as C from '../components/Card/Card';
import { formatPhoneToDisplay } from '../common/phone/phone-helper';
import ErrorBlock, { ErrorSummary } from '../components/ErrorBlock/ErrorBlock';
import { asMoney } from '../common/format';
import { trans } from '../common/trans';
import Inbox from '../resources/svgs/inbox.svg';
import DateSelector from '../components/DateSelector/DateSelector';
import { now } from '../common/moment-utils';
import IconButton from '../components/IconButton/IconButton';

import styles from './ContactForm.scss';

const cx = classNames.bind(styles);

@observer
export class ContactFormComponent extends Component {
  async componentDidMount() {
    const { webSiteStore } = this.props;
    if (webSiteStore) {
      await this.props.guestCardModel.createForm(webSiteStore);
    } else {
      await this.props.guestCardModel.loadForm();
    }
  }

  @computed
  get form() {
    const { form } = this.props.guestCardModel;

    return form || {};
  }

  @computed
  get fields() {
    const { fields } = this.form;
    return fields || {};
  }

  formatPhone = () => {
    const { phone } = this.fields;

    phone && phone.setValue(formatPhoneToDisplay(phone.value));
  };

  @observable
  submitAttempt = 0;

  @action
  submit = async () => {
    if (this.submitAttempt === 0) {
      this.submitAttempt++;
    }

    const { form, props } = this;
    await form.validate();

    if (!form.valid) return;

    const { serializedData: formData } = form;
    const { onSubmit, guestCardModel } = props;

    const formToSend = { ...formData, qualificationQuestions: { moveInTime: formData.moveInTime } };
    await guestCardModel.saveForm(formToSend);

    if (guestCardModel.saveFormError) return;

    this.updateStore(formData);

    onSubmit && onSubmit();
  };

  @computed
  get loading() {
    return this.props.guestCardModel.loading;
  }

  @computed
  get minDate() {
    const { guestCardModel } = this.props;
    const { propertyTimezone } = guestCardModel;

    return now({ timezone: propertyTimezone }).startOf('day');
  }

  renderItem = entry => {
    if (!entry) return <noscript />;
    return (
      <div style={{ width: '100%' }}>
        <T.Text ellipsis style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
          <span>{entry.value}</span>
          <span>{asMoney(entry.baseRent)}</span>
        </T.Text>
      </div>
    );
  };

  @action
  updateStore = formData => {
    const { webSiteStore } = this.props;
    if (webSiteStore) {
      webSiteStore.setFullName(formData.name);
      webSiteStore.setEmail(formData.email);
      webSiteStore.setPhoneNo(formData.phone);
      formData.moveInDate && webSiteStore.setMoveInDate(formData.moveInDate);
      formData.moveInTime && webSiteStore.setMoveInTime(formData.moveInTime);
    }
  };

  render() {
    const { guestCardModel, hideSubmit, compact, wide, phoneMessage, noPadding, className, noScrollbars } = this.props;
    const { form, formData, saveFormError, propertyTimezone } = guestCardModel;
    const { fields, summary } = form || {};

    const cols = compact ? 12 : 8;

    return (
      <C.Card className={cx('card', className, { wide })} data-id="contactFormCard">
        {form && (
          <C.Content className={cx('content', { compact, noScrollbars, hasError: summary?.length })} container={!noPadding}>
            {this.submitAttempt > 0 && <ErrorSummary title={trans('ERROR_SUMMARY_TITLE', 'Some of the required fields are missing')} summary={summary} />}
            {guestCardModel.showMoveInDate && (
              <FormField
                columns={cols}
                selectedDate={fields.moveInDate.value}
                fieldLast
                min={this.minDate}
                placeholder={trans('MOVE_IN_DATE', 'When do you plan to move in?*')}
                Component={DateSelector}
                tabIndex={0}
                field={fields.moveInDate}
                tz={propertyTimezone}
                autoComplete="off"
                autoFocus={true}
              />
            )}
            <FormField
              columns={cols}
              fieldLast
              placeholder={trans('FULL_NAME', 'Full Name*')}
              data-id="contactInfoFullName"
              Component={TextBox}
              field={fields.name}
              tabIndex={0}
              autoComplete="name"
              autoFocus={!guestCardModel.showMoveInDate && true}
            />
            <FormField
              columns={cols}
              fieldLast
              placeholder={trans('PHONE', 'Phone*')}
              data-id="contactInfoPhoneNumber"
              Component={TextBox}
              field={fields.phone}
              onBlur={this.formatPhone}
              autoComplete="tel-national"
            />
            {phoneMessage}
            <FormField
              columns={cols}
              fieldLast
              placeholder={trans('EMAIL', 'Email*')}
              data-id="contactInfoEmail"
              Component={TextBox}
              field={fields.email}
              tabIndex={0}
              autoComplete="email"
            />
            {fields.expectedTermLength && (
              <FormField
                columns={cols}
                inline
                last
                renderItem={this.renderItem}
                placeholder={trans('EXPECTED_TERM_LENGTH', 'Expected term length*')}
                data-id="contactInfoTermLength"
                Component={Dropdown}
                field={fields.expectedTermLength}
                items={formData.termLengths}
              />
            )}
            {guestCardModel.showMoveInRange && (
              <FormField
                columns={cols}
                selectedDate={fields.moveInTime.value}
                items={guestCardModel.moveInRangeValues}
                fieldLast
                placeholder={trans('MOVE_IN_DATE', 'When do you plan to move in?')}
                Component={Dropdown}
                big
                tabIndex={0}
                field={fields.moveInTime}
              />
            )}
            {fields.numberOfPets && (
              <FormField
                columns={cols}
                fieldLast
                placeholder={trans('NUMBER_OF_PETS', 'Number of pets*')}
                data-id="contactInfoPetsNumber"
                Component={Dropdown}
                field={fields.numberOfPets}
                tabIndex={0}
                items={formData.petsNumber}
              />
            )}
            {fields.message && (
              <FormField
                columns={cols}
                fieldLast
                multiline
                placeholder={trans('ADDITIONAL_COMMENTS', 'Additional comments')}
                data-id="contactInfoAdditionalComments"
                Component={TextBox}
                tabIndex={0}
                field={fields.message}
              />
            )}
            <Observer>
              {() => {
                if (guestCardModel.loading) {
                  return <LoadingBlock opaque />;
                }
                return <noscript />;
              }}
            </Observer>
            {saveFormError && <ErrorBlock message={saveFormError} />}
          </C.Content>
        )}
        {!hideSubmit && (
          <C.Actions container>
            <IconButton wide={compact} disabled={this.loading} icon={Inbox} type="raised" label={trans('SEND', 'Send')} onClick={this.submit} />
          </C.Actions>
        )}
        {form && (
          <>
            <FormField fieldStyle={NON_VISIBLE_FIELD} field={fields._userName_} placeholder="UserName" Component={TextBox} />
            <FormField fieldStyle={NON_VISIBLE_FIELD} field={fields._name_} placeholder="Name" Component={TextBox} />
          </>
        )}
      </C.Card>
    );
  }
}

const ContactForm = inject(({ guestCardModel, webSiteStore }) => ({
  guestCardModel,
  webSiteStore,
}))(ContactFormComponent);

export default ContactForm;
