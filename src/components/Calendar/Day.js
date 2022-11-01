/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

/* eslint-disable react/no-multi-comp */
import classNames from 'classnames/bind';
import React, { Component } from 'react';
import shallowCompare from '../../common/shallowCompare';
import * as T from '../Typography/Typopgraphy';
import styles from './Calendar.scss';

const cx = classNames.bind(styles);

export default class Day extends Component {
  shouldComponentUpdate(nextProps) {
    const toCompare = ['selected', 'disabled', 'selectable', 'header', 'today', 'dayToRender', 'monthToRender'];
    return !shallowCompare(nextProps, this.props, toCompare);
  }

  render() {
    const { selected, selectable, onClick, header, today, dayToRender, disabled, compact } = this.props;
    const blue = today && !selected;

    return (
      <div
        data-part="day"
        data-selected={selected}
        data-selectable={selectable}
        data-disabled={disabled}
        className={cx('day', { selected, selectable, disabled })}
        onClick={(selectable && (() => onClick && onClick())) || (() => {})}>
        <div className={cx('day-wrapper')}>
          <div data-part="circle" className={cx('circle')}>
            <svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
              <circle cx="20" cy={compact ? '18' : '20'} r={compact ? '18' : '20'} />
            </svg>
          </div>
          <div className={cx('day-number-container')}>
            <T.Caption
              data-today={today}
              className={cx('day-number', { blue })}
              secondary={header || disabled}
              lighterForeground={selected && !disabled}
              data-id="DayNumberContainer">
              {dayToRender}
            </T.Caption>
          </div>
        </div>
      </div>
    );
  }
}
