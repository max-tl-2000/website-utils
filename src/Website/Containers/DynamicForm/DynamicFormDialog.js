/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

import React, { Component } from 'react';
import { observer } from 'mobx-react';
import classnames from 'classnames/bind';
import styles from './DynamicFormDialog.scss';
import Button from '../../../components/Button/Button';
import SimpleDialog from '../../../components/SimpleDialog/SimpleDialog';
import ThankYouCard from '../../../BookAppointment/ThankYouCard/ThankYouCard';
import ThankYouImage from '../../../resources/svgs/inbox.svg';
import * as W from '../../../components/Wizard/Wizard';
import DynamicFormWrapper from './DynamicFormWrapper';

const cx = classnames.bind(styles);

@observer
export default class DynamicFormDialog extends Component {
  handleCloseRequest = () => {
    const { onCloseRequest } = this.props;
    onCloseRequest && onCloseRequest();
  };

  handleClosed = () => {
    const { onClosed } = this.props;
    onClosed && onClosed();
  };

  handleSubmitSuccess = () => {
    const { dlg } = this.props;
    dlg && dlg.setWizardIndex(1);
  };

  render() {
    const { formId, isOpen, fields, translations, wizardIndex, properties, model, transformPayload, screen } = this.props;

    return (
      <SimpleDialog showCloseAction closeOnEscape open={isOpen} onCloseRequest={this.handleCloseRequest} onClosed={this.handleClosed} renderButton={false}>
        <div className={cx('dialogContentWrapper')}>
          <W.Wizard className={cx('mainContainer', { small2: screen.matchSmall2 })} index={wizardIndex}>
            <W.Step container={false}>
              <DynamicFormWrapper
                translations={translations}
                formId={formId}
                fields={fields}
                properties={properties}
                model={model}
                dynamicFormClassName={cx('dynamicFormClassName', { noPadding: screen.matchSmall2 })}
                onSubmitSuccess={this.handleSubmitSuccess}
                transformPayload={transformPayload}
              />
            </W.Step>
            <W.Step container={false}>
              <div className={cx('thankYouContent', { small2: screen.matchSmall2 })}>
                <ThankYouCard
                  thankYouSubTitle1={translations.thankYouTitle}
                  thankYouSubTitle2={translations.thankYouSubTitle}
                  thankYouImage={<ThankYouImage className={cx('thankYouImage')} />}
                />
                <Button className={cx('btnClose')} big label={translations.thankYouCloseLabel} onClick={this.handleCloseRequest} />
              </div>
            </W.Step>
          </W.Wizard>
        </div>
      </SimpleDialog>
    );
  }
}
