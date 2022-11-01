/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

import React, { Component } from 'react';
import classNames from 'classnames/bind';
import styles from './PoiInfoWindow.scss';
import * as T from '../../../components/Typography/Typopgraphy';

const cx = classNames.bind(styles);

export default class PoiInfoWindow extends Component {
  render() {
    const { name = '', vicinity = '' } = this.props;

    return (
      <>
        <T.Text className={cx('poiName')}>{name}</T.Text>
        <T.Text secondary className={cx('poiAddress')}>
          {vicinity}
        </T.Text>
      </>
    );
  }
}
