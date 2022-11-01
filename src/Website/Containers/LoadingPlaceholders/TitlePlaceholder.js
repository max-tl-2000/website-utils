/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

import React from 'react';
import classNames from 'classnames/bind';
import styles from './LoadingPlaceholders.scss';

const cx = classNames.bind(styles);

const TitlePlaceholder = () => <div className={cx('skeleton-title')} />;

export default TitlePlaceholder;
