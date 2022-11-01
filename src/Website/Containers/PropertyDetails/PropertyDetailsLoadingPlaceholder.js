/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

import React from 'react';
import classNames from 'classnames/bind';
import styles from './PropertyDetailsLoadingPlaceholder.scss';

const cx = classNames.bind(styles);

const PropertyDetailsLoadingPlaceholder = () => (
  <div>
    <div className={cx('medium-layout')}>
      <div className={cx('search-section')}>
        <div className={cx('search-box-ph')} />
        <div className={cx('search-button-ph')} />
      </div>
      <div className={cx('content-section')}>
        <div className={cx('property-details-info')}>
          <div className={cx('line-ph')} />
          <div className={cx('explore-map-section')}>
            <div className={cx('line-ph')} />
            <div className={cx('line-ph')} />
          </div>
          <div className={cx('line-ph')} />
        </div>

        <div className={cx('property-contact-data')}>
          <div className={cx('line-ph')} />
          <div className={cx('links-section')}>
            <div className={cx('line-ph')} />
            <div className={cx('line-ph')} />
          </div>
        </div>
      </div>
    </div>
    <div className={cx('small-layout')}>
      <div className={cx('search-box-ph')} />
      <div className={cx('details-info')}>
        <div className={cx('line-ph')} />
        <div className={cx('line-ph')} />
        <div className={cx('line-ph')} />
      </div>

      <div className={cx('property-detail-actions')}>
        <div className={cx('line-ph')} />
        <div className={cx('line-ph')} />
        <div className={cx('line-ph')} />
      </div>

      <div className={cx('line-ph', { phoneLine: true })} />

      <div className={cx('search-button-ph')} />
    </div>
  </div>
);

export default PropertyDetailsLoadingPlaceholder;
