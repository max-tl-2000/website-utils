/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { trans } from '../../common/trans';
import ThankYouStepCard from '../ThankYouStepCard/ThankYouStepCard';
import CancelFeedbackForm from '../CancelFeedbackForm/CancelFeedbackForm';

@observer
export default class CancelStep2 extends Component {
  render() {
    const title = trans('APPOINTMENT_IS_CANCELED', 'Your appointment has been canceled.');
    const subTitle = trans('YOU_WILL_GET_CONFIRMATION', "You'll get a confirmation email shortly");

    return (
      <ThankYouStepCard title={title} subTitle={subTitle} showFooterLine={false}>
        <CancelFeedbackForm />
      </ThankYouStepCard>
    );
  }
}
