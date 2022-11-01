/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

import React from 'react';
import classNames from 'classnames/bind';
import styles from './LifeStylesPlaceholders.scss';

const cx = classNames.bind(styles);

const renderRows = rows => Array.from({ length: rows }, (_, index) => <div key={index} className={cx('amenity-row')} />);

const renderSections = (columns, rows) =>
  Array.from({ length: columns }, (_, index) => (
    <div key={index} className={cx('amenity-column')}>
      {renderRows(rows)}
    </div>
  ));

const AmenitiesLoadingPlaceholder = ({ columns = 2, rows = 4 }) => (
  <div className={cx('skeleton-container')}>
    <div className={cx('title')} />
    <div className={cx('amenities-section-container')}>{renderSections(columns, rows)}</div>
  </div>
);

export default AmenitiesLoadingPlaceholder;
