/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

import React, { Component } from 'react';
import classnames from 'classnames/bind';
import Button from '../../../components/Button/Button';
import styles from './LightButton.scss';

const cx = classnames.bind(styles);

export default class LightButton extends Component {
  render() {
    const { className, type = 'flat', label = 'raised', btnRole = 'primary', onClick, disabled } = this.props;

    return <Button className={cx('LightButton', className)} btnRole={btnRole} type={type} label={label} onClick={onClick} disabled={disabled} />;
  }
}
