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

const renderBlocks = blocks =>
  Array.from({ length: blocks }, (_, index) => (
    <div key={index} className={cx('blocks-skeleton')}>
      <div className={cx('main-content')} />
      <div className={cx('content-desc')} />
    </div>
  ));

const LifeStylesLoadingPlaceholder = ({ blocks = 6 }) => (
  <div className={cx('skeleton-container')}>
    <div className={cx('title')} />
    <div className={cx('blocks-container')}>{renderBlocks(blocks)}</div>
  </div>
);

export default LifeStylesLoadingPlaceholder;
