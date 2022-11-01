/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import classnames from 'classnames/bind';

import { trans } from '../../common/trans';
import styles from './ContactInfoForm.scss';
import TextBox from '../../components/TextBox/TextBox';

import * as T from '../../components/Typography/Typopgraphy';
import * as C from '../../components/Card/Card';
import { formatPhoneToDisplay } from '../../common/phone/phone-helper';
import LoadingBlock from '../../components/LoadingBar/LoadingBlock';
import { FormField, NON_VISIBLE_FIELD } from '../../common/FormField';
import Dropdown from '../../components/Dropdown/Dropdown';
import DatePicker from '../../components/DatePicker/DatePicker';
import { ErrorSummary } from '../../components/ErrorBlock/ErrorBlock';
import DateSelector from '../../components/DateSelector/DateSelector';
import CheckBox from '../../components/CheckBox/CheckBox';
import PickBox from '../../components/PickBox/PickBox';

const cx = classnames.bind(styles);

@inject('selfServeModel')
@observer
export default class ContactInfoForm extends Component {
  constructor(props) {
    super(props);
    const { acm } = this.props;
    const { contactFormModel } = acm;
    const { syncFromWebSiteStore } = contactFormModel;
    syncFromWebSiteStore && syncFromWebSiteStore();
  }

  formatPhone = () => {
    const {
      acm: {
        contactFormModel: { mobilePhone },
      },
    } = this.props;
    mobilePhone.setValue(formatPhoneToDisplay(mobilePhone.value));
  };

  getComponent = type => {
    if (type === 'TextArea') return TextBox;
    if (type === 'Dropdown') return Dropdown;
    if (type === 'DatePicker') return DatePicker;
    if (type === 'DateSelector') return ({ value, ...rest }) => <DateSelector {...rest} selectedDate={value} />;
    if (type === 'CheckBox') return CheckBox;
    if (type === 'PickBox') return PickBox;

    return TextBox;
  };

  renderDynamicFields = options => {
    const { acm } = this.props;
    const { contactFormModel } = acm;
    const { dynamicFields, fields } = contactFormModel;
    const { columnWidth } = options;

    return dynamicFields.map(f => {
      const { name } = f;
      const field = fields[name];
      const { meta } = field;
      const props = {};

      const Comp = this.getComponent(meta.type);

      if (meta.type === 'Dropdown') {
        props.items = meta.items;
        if (meta.big) {
          props.big = true;
        }
      }

      if (meta.type === 'TextArea') {
        props.multiline = true;
      }

      if (meta.type === 'CheckBox') {
        props.checked = !!field.value;
        props.componentLabel = meta.label;
        props.onChange = ({ checked }) => field.setValue(!!checked);
      }

      return <FormField key={name} columns={columnWidth} fieldInline fieldLast placeholder={meta.label} Component={Comp} field={field} {...props} />;
    });
  };

  renderError = errorMessage => (
    <div>
      <T.Caption error>{errorMessage.line1}</T.Caption>
      <T.Caption error>{errorMessage.line2}</T.Caption>
    </div>
  );

  render() {
    const { props } = this;
    const { acm, className, selfServeModel, compact } = props;

    const propertyTourLabel = trans('PROPERTY_TOUR_LABEL', 'Property Tour on {{appointmentDate}}', {
      appointmentDate: acm.appointmentDateFormatted,
    });

    const { useLayoutSmall } = selfServeModel;

    const { contactFormModel } = acm;

    const { dynamicFields, summary } = contactFormModel;
    const columnWidth = useLayoutSmall ? 12 : 8;

    return (
      <C.Card className={cx('ContactForm', { compact: compact || useLayoutSmall }, className)}>
        <C.Content className={cx('content')} data-id="contactInfoContainer">
          <ErrorSummary title={trans('ERROR_SUMMARY_TITLE', 'Some of the required fields are missing')} summary={summary} />
          {acm.appointmentDateFormatted && <T.Text className={cx('selectedDateTimeLabel')}>{propertyTourLabel}</T.Text>}
          <FormField
            columns={columnWidth}
            fieldInline
            fieldLast
            placeholder={trans('LEGAL_NAME', 'Legal name*')}
            data-id="contactInfoLegalName"
            Component={TextBox}
            field={contactFormModel.name}
            autoComplete="name"
          />
          <FormField
            columns={columnWidth}
            fieldInline
            fieldLast
            placeholder={trans('EMAIL', 'Email*')}
            data-id="contactInfoEmailAddress"
            Component={TextBox}
            field={contactFormModel.email}
            autoComplete="email"
          />
          <FormField
            columns={columnWidth}
            fieldInline
            fieldLast
            placeholder={trans('PHONE', 'Phone*')}
            data-id="contactInfoMobilePhone"
            Component={TextBox}
            field={contactFormModel.mobilePhone}
            autoComplete="tel-national"
            onBlur={this.formatPhone}
          />
          {dynamicFields.length > 0 && this.renderDynamicFields({ columnWidth })}
          {acm.savingAppointment && <LoadingBlock opaque />}
          {acm.appointmentSavingError && this.renderError(acm.appointmentSavingErrorMessage)}
          <FormField fieldStyle={NON_VISIBLE_FIELD} field={contactFormModel._userName_} placeholder="UserName" Component={TextBox} />
          <FormField fieldStyle={NON_VISIBLE_FIELD} field={contactFormModel._name_} placeholder="Name" Component={TextBox} />
        </C.Content>
      </C.Card>
    );
  }
}
