/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

/* eslint-disable react/prefer-stateless-function */
import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';

import classnames from 'classnames/bind';
import styles from './BookerWidget.scss';

import SizeAware from '../../../components/SizeAware/SizeAware';
import AppointmentCreate from '../../../BookAppointment/AppointmentCreate/AppointmentCreate';
import AppointmentEdit from '../../../BookAppointment/AppointmentEdit/AppointmentEdit';
import AppointmentCancel from '../../../BookAppointment/AppointmentCancel/AppointmentCancel';

const cx = classnames.bind(styles);

@inject(({ selfServeModel, webSiteStore }) => ({
  selfServeModel,
  propertyName: webSiteStore.currentPropertyStore?.property?.displayName,
}))
@observer
export default class BookerWidget extends Component {
  render() {
    const { className, selfServeModel, onBack, closeDialog, propertyName, buildingQualifiedName, useCustomizedStyle = false, matches } = this.props;
    const { isCreateMode, isEditMode, isCancelMode } = selfServeModel;

    return (
      <SizeAware className={cx('BookerWidget', className)} onSizeChange={selfServeModel.storeDimensions} data-id="bookerWidget">
        {isCreateMode && (
          <AppointmentCreate
            matches={matches}
            onBack={onBack}
            closeDialog={closeDialog}
            propertyName={propertyName}
            useCustomizedStyle={useCustomizedStyle}
            buildingQualifiedName={buildingQualifiedName}
          />
        )}
        {isEditMode && <AppointmentEdit />}
        {isCancelMode && <AppointmentCancel />}
      </SizeAware>
    );
  }
}
