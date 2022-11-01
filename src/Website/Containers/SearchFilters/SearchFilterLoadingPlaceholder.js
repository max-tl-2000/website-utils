/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

import React from 'react';
import classNames from 'classnames/bind';
import styles from './SearchFilterLoadingPlaceholder.scss';
import TitlePlaceholder from '../LoadingPlaceholders/TitlePlaceholder';

const cx = classNames.bind(styles);

const renderRows = rows =>
  Array.from({ length: rows }, (_, index) => (
    <div key={index} className={cx('rows')}>
      <div className={cx('checkbox')} />
      <div className={cx('text-line')} />
    </div>
  ));

const renderSections = (columns, rows, vertical) =>
  Array.from({ length: columns }, (_, index) => (
    <div key={index} className={cx('skeleton', { vertical })}>
      {renderRows(rows)}
    </div>
  ));

const SearchFilterLoadingPlaceholder = ({ columns = 3, rows = 3, vertical }) => (
  <div className={cx('skeleton-container')}>
    <TitlePlaceholder />
    <div className={cx('skeleton-child-container', { vertical })}>{renderSections(columns, rows, vertical)}</div>
  </div>
);

export default SearchFilterLoadingPlaceholder;
