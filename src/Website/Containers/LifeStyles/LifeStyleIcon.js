/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

import React, { Component } from 'react';
import classNames from 'classnames/bind';

import { amenities } from '@redisrupt/red-svg-icons';
import * as T from '../../../components/Typography/Typopgraphy';
import styles from './LifeStyleIcon.scss';

const cx = classNames.bind(styles);

export default class LifeStyleIcon extends Component {
  render() {
    const { icon, displayName, iconClassName } = this.props;
    const svgPath = amenities[icon];

    return (
      <div data-component="life-style-icon" className={cx('lifeStyleIcon')}>
        <div data-part="round-button" className={cx('roundButton', iconClassName)}>
          {svgPath && (
            <svg width="30" height="30" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
              <g dangerouslySetInnerHTML={{ __html: svgPath }} />
            </svg>
          )}
        </div>
        <T.Text data-part="label" secondary className={cx('label')}>
          {displayName}
        </T.Text>
      </div>
    );
  }
}
