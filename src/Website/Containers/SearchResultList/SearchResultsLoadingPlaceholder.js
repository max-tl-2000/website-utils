/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

import React from 'react';
import classNames from 'classnames/bind';
import clsc from 'coalescy';
import styles from './SearchResultsLoadingPlaceholder.scss';
import TitlePlaceholder from '../LoadingPlaceholders/TitlePlaceholder';

const cx = classNames.bind(styles);

const getColumns = (containerWidth, minCardWidth) => {
  if (!containerWidth) return 1;
  return Math.floor(containerWidth / minCardWidth);
};

const renderSections = (columns, gutter) =>
  Array.from({ length: columns }, (_, index) => (
    <div key={index} style={{ width: `calc(${100 / columns}% + ${gutter / columns}px - ${gutter}px)` }} className={cx('results-skeleton')} />
  ));

const SearchResultsLoadingPlaceholder = ({ columns, rows = 2, breakpoints, containerWidth, minCardWidth = 250, gutter = 16, displayTitle }) => {
  const cols = clsc(columns, getColumns(containerWidth, minCardWidth));
  return (
    <div className={cx('skeleton-container')}>
      {displayTitle && <TitlePlaceholder />}
      <div className={cx('skeleton-child-container', breakpoints)}>{Array.from({ length: rows }, () => renderSections(cols, gutter))}</div>
    </div>
  );
};

export default SearchResultsLoadingPlaceholder;
