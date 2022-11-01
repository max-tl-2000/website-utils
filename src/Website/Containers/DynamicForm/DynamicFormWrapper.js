/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { action, observable } from 'mobx';
import classnames from 'classnames/bind';
import styles from './DynamicFormWrapper.scss';
import DynamicForm from './DynamicForm';
import UserActivityWarning from '../UserActivity/UserActivityWarning';
import * as T from '../../../components/Typography/Typopgraphy';
import { defaultBreakpointsAsArray } from '../../../components/SizeAware/Breakpoints';
import SizeAware from '../../../components/SizeAware/SizeAware';
import SimpleDialog from '../../../components/SimpleDialog/SimpleDialog';
import ThankYouCard from '../../../BookAppointment/ThankYouCard/ThankYouCard';
import ThankYouImage from '../../../resources/svgs/inbox.svg';
import Button from '../../../components/Button/Button';
import sleep from '../../../common/sleep';
import { createDynamicForm } from '../../../common/form-factory';

const cx = classnames.bind(styles);

@inject(({ webSiteStore, actions }) => ({
  onSubmitClick: actions.onSubmitClick,
  propertyId: webSiteStore.currentPropertyStore?.propertyId,
  properties: webSiteStore.properties,
}))
@observer
export default class DynamicFormWrapper extends Component {
  @observable
  formModel;

  constructor(props) {
    super(props);
    this.formModel = createDynamicForm(props.formId, props.fields);
  }

  @observable
  showMessageAfterSuccess;

  @observable
  submitSuccess = false;

  @action
  setSubmitSuccess = value => {
    this.submitSuccess = value;
  };

  @action
  updateShowMessageAfterSuccess(value) {
    this.showMessageAfterSuccess = value;
  }

  @action
  resetForm = async () => {
    const { onResetRequest } = this.props;
    onResetRequest?.();

    await sleep(200);
    this.formModel.restoreInitialValues();
    this.setSubmitSuccess(false);
  };

  @action
  handleSubmit = async args => {
    const { onSubmitSuccess, propertyId, model, transformPayload, messageAfterSuccess } = this.props;

    let payload = {
      ...args.data,
      propertyId,
    };

    if (transformPayload) {
      payload = await transformPayload(payload);
    }

    const messageSubmited = await model.save(payload);

    if (messageSubmited) {
      onSubmitSuccess && (await onSubmitSuccess(args));
      if (messageAfterSuccess) {
        this.updateShowMessageAfterSuccess(true);
      }
      this.setSubmitSuccess(true);
    }
  };

  renderFormTitle = (formTitle, matches, noPaddingAtSides) => (
    <div className={cx('formHeader', { noPaddingAtSides }, matches)}>
      <T.Header noMargin={matches.small1} className={cx({ bigTitle: matches.small1 }, 'serifFont')}>
        {formTitle}
      </T.Header>
    </div>
  );

  render() {
    const {
      translations = {},
      properties,
      horizontal,
      model,
      buttonColumns,
      noPaddingAtSides,
      title,
      showTitle = true,
      buttonSmall,
      buttonTitle,
      showIcon = true,
      showLabels,
      messageAfterSuccess,
      dynamicFormClassName,
      showConfirmCardAfterSuccess,
    } = this.props;
    const errorMessage = model.error;
    const errorMessageSubmittingForm = errorMessage ? translations.errorMessage || errorMessage : '';

    return (
      <SizeAware breakpoints={defaultBreakpointsAsArray} className={styles.dynamicFormWrapper}>
        {({ matches }) => (
          <div className={styles.container}>
            {showTitle && this.renderFormTitle(title || translations.formTitle, matches, noPaddingAtSides)}
            {!this.submitSuccess && <UserActivityWarning />}
            {!(this.showMessageAfterSuccess || (showConfirmCardAfterSuccess && this.submitSuccess)) && (
              <DynamicForm
                formModel={this.formModel}
                className={dynamicFormClassName}
                noPaddingAtSides={noPaddingAtSides}
                compact={!matches.small1}
                fullWidth={!(horizontal && matches.small2)}
                onSubmit={this.handleSubmit}
                submitLabel={buttonTitle || translations.submitLabel}
                loading={model.loading}
                errorMessage={errorMessageSubmittingForm}
                errorSummaryTitle={translations.errorSummaryTitle}
                properties={properties}
                horizontal={horizontal && matches.small2}
                buttonColumns={buttonColumns}
                buttonSmall={buttonSmall}
                showIcon={showIcon}
                showLabels={showLabels}
              />
            )}
            {this.showMessageAfterSuccess && !showConfirmCardAfterSuccess && (
              <div className={cx('successMessage')}>
                <T.Title>{messageAfterSuccess}</T.Title>
              </div>
            )}
            {showConfirmCardAfterSuccess && this.submitSuccess && (
              <div className={cx('thankYouContent')}>
                <ThankYouCard
                  thankYouSubTitle1={translations.thankYouSubTitle1}
                  thankYouSubTitle2={translations.thankYouSubTitle2}
                  thankYouImage={<ThankYouImage className={cx('thankYouImage')} />}
                />
                <Button className={cx('btnClose')} btnRole="primary" label={translations.thankYouCloseLabel} onClick={this.resetForm} />
              </div>
            )}
          </div>
        )}
      </SizeAware>
    );
  }
}

@observer
export class DynamicFormDialogWrapper extends Component {
  render() {
    const { dlgModel, wrapperClassName, ...rest } = this.props;

    return (
      <SimpleDialog showCloseAction closeOnEscape open={dlgModel.isOpen} onCloseRequest={dlgModel.close} renderButton={false}>
        <div className={cx('dialogWrapper', wrapperClassName)}>
          <DynamicFormWrapper {...rest} />
        </div>
      </SimpleDialog>
    );
  }
}
