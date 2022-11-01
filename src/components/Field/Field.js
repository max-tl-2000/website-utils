/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

import React from 'react';
import classnames from 'classnames/bind';
import styles from './Field.scss';
import { widthInColumns } from '../../common/width-in-columns';
import nullish from '../../common/nullish';

const cx = classnames.bind(styles);

const Field = ({
  children,
  vAlign = 'center',
  columns,
  noMargin,
  gutterWidth,
  gutterType,
  totalColumns,
  last,
  style,
  inline,
  hoverable,
  fullWidth,
  halfWidth,
  flex,
  className,
  wrapperClassName,
  maxWidth,
  noMinHeight,
  setMarginLeft,
  ...props
}) => {
  let cellStyle = {};
  if (columns && columns > 0) {
    cellStyle = widthInColumns(columns, {
      gutterWidth,
      totalColumns,
      last,
      gutterType,
    });
  }
  if (!nullish(maxWidth)) {
    cellStyle.maxWidth = maxWidth;
  }
  return (
    <div
      data-component="field"
      style={{ ...style, ...cellStyle }}
      className={cx(
        'field',
        {
          [`v-align-${vAlign}`]: true,
          noMargin,
          hoverable,
          inline,
          fullWidth,
          halfWidth,
          flex,
        },
        className,
      )}
      {...props}>
      <div
        data-component="field-middle-wrapper"
        className={cx('middle-wrapper', { middleWrapperNoHeight: noMinHeight, middleWrapperLeftMargin: setMarginLeft })}>
        <div data-component="field-wrapper" className={cx('field-wrapper', wrapperClassName)}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Field;
