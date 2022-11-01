/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

import React, { Component } from 'react';
import classNames from 'classnames/bind';
import { observer, inject } from 'mobx-react';
import trim from 'jq-trim';

import IconButton from '../../../components/IconButton/IconButton';
import Settings from '../../../resources/svgs/Settings.svg';
import { DialogModel } from '../../../common/DialogModel';
import SimpleDialog from '../../../components/SimpleDialog/SimpleDialog';
import styles from './AppSettingsForm.scss';
import Field from '../../../components/Field/Field';
import TextBox from '../../../components/TextBox/TextBox';
import * as T from '../../../components/Typography/Typopgraphy';
import * as C from '../../../components/Card/Card';
import Button from '../../../components/Button/Button';
import Dropdown from '../../../components/Dropdown/Dropdown';
import CheckBox from '../../../components/CheckBox/CheckBox';
import Scrollable from '../../../components/Scrollable/Scrollable';
import { appState } from '../../Stores/AppState';

const cx = classNames.bind(styles);

export const createRoot = () => {
  const div = document.createElement('div');

  div.classList.add(cx('appSettingsRoot'));

  document.body.appendChild(div);

  return div;
};

@inject('appSettings')
@observer
export default class AppSettingsForm extends Component {
  constructor(props) {
    super(props);
    this.dlgModel = new DialogModel();
    this.form = props.appSettings.getEditableFormModel();
  }

  openDialog = () => {
    this.dlgModel.open();
  };

  closeDialog = () => {
    this.dlgModel.close();
  };

  handleSave = async () => {
    const { props, form } = this;
    const { appSettings } = props;

    await form.validate();

    if (form.valid) {
      const { serializedData } = form;
      appSettings.saveSettings(serializedData);
      appState.clearSession();
      window.location.reload();
    }
  };

  reset = () => {
    const { props } = this;
    const { appSettings } = props;

    appSettings.restoreSettings();
    appState.clearSession();
    window.location.reload();
  };

  availableFormats = [{ id: 'hyphen', value: 'Hyphen' }, { id: 'dot', value: 'Dot' }, { id: 'parentheses', value: 'Parentheses' }];

  render() {
    const { fields } = this.form;

    return (
      <>
        <IconButton icon={Settings} onClick={this.openDialog} />
        <SimpleDialog open={this.dlgModel.isOpen} onCloseRequest={this.closeDialog} renderButton={false}>
          <C.Card className={cx('appForm')}>
            <C.Content container noPaddingBottom>
              <T.Header className={cx('header')}>Settings</T.Header>
              <Scrollable className={cx('fields')} innerClassName={cx('wrapper')}>
                <Field className={cx('field')} noMargin>
                  <T.Caption>Host *</T.Caption>
                  <TextBox
                    error={fields.host.errorMessage}
                    wide
                    autoComplete="none"
                    value={fields.host.value}
                    onBlur={() => fields.host.validate(true)}
                    onChange={args => fields.host.setValue(trim(args.value))}
                  />
                </Field>
                <Field className={cx('field')} noMargin>
                  <T.Caption>Token *</T.Caption>
                  <TextBox
                    error={fields.token.errorMessage}
                    wide
                    multiline
                    autoComplete="none"
                    value={fields.token.value}
                    onBlur={() => fields.token.validate(true)}
                    onChange={args => fields.token.setValue(trim(args.value))}
                  />
                </Field>
                <Field className={cx('field')} noMargin>
                  <T.Caption>Google Maps Api Token *</T.Caption>
                  <TextBox
                    error={fields.googleMapsApiToken.errorMessage}
                    wide
                    autoComplete="none"
                    value={fields.googleMapsApiToken.value}
                    onBlur={() => fields.googleMapsApiToken.validate(true)}
                    onChange={args => fields.googleMapsApiToken.setValue(trim(args.value))}
                  />
                </Field>
                <Field className={cx('field')} noMargin>
                  <T.Caption>Phone format</T.Caption>
                  <Dropdown
                    error={fields.defaultPhoneFormat.errorMessage}
                    wide
                    items={this.availableFormats}
                    value={fields.defaultPhoneFormat.value}
                    onBlur={() => fields.defaultPhoneFormat.validate(true)}
                    onChange={args => fields.defaultPhoneFormat.setValue(args.value)}
                  />
                </Field>
                <Field className={cx('field')} noMargin>
                  <T.Caption>Track window size changes</T.Caption>
                  <CheckBox
                    error={fields.trackWindowSizeChange.errorMessage}
                    label="Add helper data-attributes to make responsive design easier"
                    checked={fields.trackWindowSizeChange.value}
                    onBlur={() => fields.trackWindowSizeChange.validate(true)}
                    onChange={args => fields.trackWindowSizeChange.setValue(args.checked)}
                  />
                </Field>
              </Scrollable>
            </C.Content>
            <C.Actions container className={cx('actions')}>
              <Button label="Reset" type="flat" btnRole="secondary" onClick={this.reset} />
              <div className={cx('mainActions')}>
                <Button label="Close" type="flat" btnRole="secondary" onClick={this.closeDialog} />
                <Button label="Save" type="flat" btnRole="primary" onClick={this.handleSave} />
              </div>
            </C.Actions>
          </C.Card>
        </SimpleDialog>
      </>
    );
  }
}
