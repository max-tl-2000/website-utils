/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

import React from 'react';
import classnames from 'classnames/bind';
import styles from './AppointmentButton.scss';
import * as T from '../../components/Typography/Typopgraphy';

const cx = classnames.bind(styles);

const AppointmentButton = ({ label, className, active, ...rest }) => (
  <button data-component="appointment-button" data-active={active} type="button" className={cx('AppointmentButton', { active }, className)} {...rest}>
    <T.Text data-part="label" className={cx('label')} inline>
      {label}
    </T.Text>
  </button>
);

export default AppointmentButton;
