/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import * as W from '../../components/Wizard/Wizard';
import LoadingBlock from '../../components/LoadingBar/LoadingBlock';
import ErrorBlock from '../../components/ErrorBlock/ErrorBlock';
import CancelStep1 from '../CancelStep1/CancelStep1';
import CancelStep2 from '../CancelStep2/CancelStep2';

@inject('appointmentCancelModel', 'selfServeModel')
@observer
export default class AppointmentCancel extends Component {
  constructor(props) {
    super(props);
    props.appointmentCancelModel.loadAppointment();
  }

  render() {
    const { appointmentCancelModel: acm } = this.props;

    return (
      <div style={{ minHeight: 500, position: 'relative' }}>
        {acm.appointmentLoaded && (
          <W.Wizard index={acm.wizardIndex}>
            <W.Step>
              <CancelStep1 appointmentCancelModel={acm} />
            </W.Step>
            <W.Step>
              <CancelStep2 />
            </W.Step>
          </W.Wizard>
        )}
        {acm.appointmentLoading && <LoadingBlock />}
        {acm.appointmentLoadingError && <ErrorBlock fill message={acm.appointmentLoadingError} />}
      </div>
    );
  }
}
