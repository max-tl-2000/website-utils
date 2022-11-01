/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

import React from 'react';
import classNames from 'classnames/bind';
import styles from './NavigationLoadingPlaceholder.scss';

const cx = classNames.bind(styles);

const renderRows = rows => Array.from({ length: rows }, (_, index) => <div key={index} style={{ width: '100%' }} className={cx('row')} />);

const renderSections = (columns, rows) =>
  Array.from({ length: columns }, (_, index) => (
    <div key={index} className={cx('rows-skeleton')}>
      {renderRows(rows)}
    </div>
  ));

const NavigationLoadingPlaceholder = ({ columns = 5, rows = 7, breakpoints }) => (
  <>
    <div className={cx('title')} />
    <div className={cx('skeleton-container', breakpoints)}>{renderSections(columns, rows)}</div>
  </>
);

export default NavigationLoadingPlaceholder;
