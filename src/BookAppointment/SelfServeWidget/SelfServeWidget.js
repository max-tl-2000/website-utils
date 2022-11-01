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
import styles from './SelfServeWidget.scss';
import SizeAware from '../../components/SizeAware/SizeAware';
import AppointmentCreate from '../AppointmentCreate/AppointmentCreate';
import AppointmentEdit from '../AppointmentEdit/AppointmentEdit';
import AppointmentCancel from '../AppointmentCancel/AppointmentCancel';

const cx = classnames.bind(styles);

@inject(({ selfServeModel }) => ({
  selfServeModel,
}))
@observer
export default class SelfServeWidget extends Component {
  render() {
    const { className, selfServeModel, onBack, closeDialog, propertyName } = this.props;
    const { isCreateMode, isEditMode, isCancelMode } = selfServeModel;

    return (
      <SizeAware className={cx('SelfServeWidget', className)} onSizeChange={selfServeModel.storeDimensions}>
        {isCreateMode && <AppointmentCreate onBack={onBack} closeDialog={closeDialog} propertyName={propertyName} />}
        {isEditMode && <AppointmentEdit />}
        {isCancelMode && <AppointmentCancel />}
      </SizeAware>
    );
  }
}
