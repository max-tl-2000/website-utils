/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

import React, { Component } from 'react';
import { observer, Observer } from 'mobx-react';
import { observable, action } from 'mobx';
import clsc from 'coalescy';
import classnames from 'classnames/bind';
import styles from './DynamicForm.scss';
import { FormField, NON_VISIBLE_FIELD } from '../../../common/FormField';
import Inbox from '../../../resources/svgs/inbox.svg';
import * as C from '../../../components/Card/Card';
import LoadingBlock from '../../../components/LoadingBar/LoadingBlock';
import ErrorBlock, { ErrorSummary } from '../../../components/ErrorBlock/ErrorBlock';
import IconButton from '../../../components/IconButton/IconButton';
import TextBox from '../../../components/TextBox/TextBox';
import Dropdown from '../../../components/Dropdown/Dropdown';
import DatePicker from '../../../components/DatePicker/DatePicker';
import QueryFilter, { SearchCategory } from '../QueryFilter/QueryFilter';
import CheckBox from '../../../components/CheckBox/CheckBox';
import PickBox from '../../../components/PickBox/PickBox';
import { createDynamicForm } from '../../../common/form-factory';
import { formatPhoneToDisplay } from '../../../common/phone/phone-helper';
import Field from '../../../components/Field/Field';
import { isObject } from '../../../common/type-of';
import Button from '../../../components/Button/Button';

const cx = classnames.bind(styles);

@observer
export default class DynamicForm extends Component {
  @observable
  formModel;

  constructor(props) {
    super(props);
    this.formModel = props.formModel || createDynamicForm(props.formId, props.fields);
  }

  getComponent = type => {
    if (type === 'TextArea') return TextBox;
    if (type === 'Dropdown') return Dropdown;
    if (type === 'DatePicker') return DatePicker;
    if (type === 'QueryFilter') return QueryFilter;
    if (type === 'CheckBox') return CheckBox;
    if (type === 'PickBox') return PickBox;

    return TextBox;
  };

  formatPhone = () => {
    const { phone } = this.formModel.fields;

    phone && phone.setValue(formatPhoneToDisplay(phone.value));
  };

  setCommunity = property => {
    const { property: propertyField } = this.formModel.fields;
    propertyField.setValue(
      property
        ? {
            propertyId: property.propertyId,
            propertyName: property.displayName,
            city: property.region,
            state: property.state,
          }
        : null,
    );
  };

  handleCommunitySelection = ({ value }) => {
    if (!value || !isObject(value) || !Object.keys(value || {}).length) {
      this.setCommunity(null);
      return;
    }

    const {
      query: { propertyId },
    } = value;

    const property = (this.props.properties || []).find(it => it.propertyId === propertyId);
    this.setCommunity(property);
  };

  renderFields = ({ columns, fullWidth, showLabels }) => {
    const { fields } = this.formModel;

    const keys = Object.keys(this.props.fields || fields);

    return keys.map(name => {
      const field = fields[name];
      const { meta } = field;
      const props = {
        tabIndex: 0,
      };

      const component = this.getComponent(meta.type);

      if (meta.type === 'Dropdown') {
        props.items = meta.items;
        if (meta.big) {
          props.big = true;
        }
        if (meta.autoFocus) {
          props.autoFocus = true;
        }
      }

      if (meta.small) {
        props.small = true;
      }

      if (meta.type === 'TextArea') {
        props.multiline = true;
      }

      if (meta.type === 'CheckBox') {
        props.checked = !!field.value;
        props.componentLabel = meta.label;
        props.onChange = ({ checked }) => field.setValue(!!checked);
      }

      // We should move this out of this component, we should pass a function to
      // configure this kind of component from outside that way this component
      // does not need to know about the properties
      if (meta.type === 'QueryFilter') {
        props.customPlaceholder = meta.label;
        props.customNoMatchFoundText = meta.noMatchFoundText;
        props.properties = this.props.properties || [];
        props.categories = [SearchCategory.COMMUNITY];
        props.onChange = this.handleCommunitySelection;
        props.onItemClick = value => this.handleCommunitySelection({ value });
        props.onClear = () => this.setCommunity(null);
        if (meta.autoFocus) {
          props.autoFocus = true;
        }
      }

      const isHoneypotField = name === '_userName_' || name === '_name_';
      const formatEventProp = name === 'phone' ? { onBlur: this.formatPhone } : {};

      const getColumns = () => {
        if (meta.columns) return meta.columns;
        if (!fullWidth) return columns;

        return null;
      };

      return (
        <FormField
          key={name}
          columns={getColumns()}
          fullWidth={fullWidth}
          fieldInline={this.props.horizontal}
          fieldLast={meta.last}
          placeholder={clsc(meta.placeholder, meta.label)}
          label={meta.label}
          showLabel={showLabels}
          Component={component}
          field={field}
          {...(isHoneypotField ? { fieldStyle: NON_VISIBLE_FIELD, Component: TextBox } : {})}
          {...formatEventProp}
          {...props}
        />
      );
    });
  };

  @action
  submit = async () => {
    const { formModel } = this;
    await formModel.validate();
    if (!formModel.valid) return;

    const { serializedData, formId } = formModel;
    const { onSubmit } = this.props;
    onSubmit && (await onSubmit({ formId, data: serializedData }));
  };

  render() {
    const {
      className,
      compact,
      fullWidth,
      wide,
      noPadding,
      noPaddingAtSides,
      submitLabel,
      loading,
      errorMessage,
      horizontal,
      buttonSmall,
      buttonColumns,
      showIcon,
      showLabels,
    } = this.props;
    const columns = compact ? 12 : 8;

    return (
      <C.Card compact={compact} className={cx('card', className, { wide })}>
        <C.Content compact={compact} className={cx('content', { compact, noPaddingAtSides })} container={!noPadding}>
          {!horizontal && <ErrorSummary title={this.props.errorSummaryTitle} summary={this.formModel?.summary} />}
          {this.renderFields({ columns, fullWidth, showLabels })}
          {horizontal && (
            <Field columns={buttonColumns} style={{ marginBottom: '.825rem' }} wrapperClassName={cx({ showLabels })} inline last>
              {!showIcon && <Button disabled={loading} type="raised" label={submitLabel} onClick={this.submit} big={!buttonSmall} wide />}
              {showIcon && <IconButton disabled={loading} icon={Inbox} type="raised" label={submitLabel} onClick={this.submit} big={!buttonSmall} wide />}
            </Field>
          )}
          {horizontal && <ErrorSummary title={this.props.errorSummaryTitle} summary={this.formModel?.summary} />}
          <Observer>
            {() => {
              if (loading) {
                return <LoadingBlock opaque />;
              }
              return <noscript />;
            }}
          </Observer>
          {!!errorMessage && <ErrorBlock message={errorMessage} />}
        </C.Content>
        {!horizontal && (
          <C.Actions container noPaddingAtSides={noPaddingAtSides} compact={compact}>
            {!showIcon && <Button className={cx('actionButton')} wide={compact} disabled={loading} type="raised" label={submitLabel} onClick={this.submit} />}
            {showIcon && (
              <IconButton
                className={cx('actionButton')}
                wide={compact}
                disabled={loading}
                icon={Inbox}
                type="raised"
                label={submitLabel}
                onClick={this.submit}
              />
            )}
          </C.Actions>
        )}
      </C.Card>
    );
  }
}
