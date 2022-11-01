/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

import React from 'react';
import classnames from 'classnames/bind';
import LoadingBars from './LoadingBar';
import styles from './LoadingBlock.scss';

const cx = classnames.bind(styles);

const LoadingBlock = ({ className, height, opaque, lighterForeground }) => {
  const color = lighterForeground ? '#fff' : '#333';
  const style = {};

  const wrappedContent = (
    <div data-c="loadingBlock" className={cx('wrapper', className, { opaque })}>
      <LoadingBars color={color} className={cx('loader')} />
    </div>
  );

  if (typeof height !== 'undefined') {
    style.position = 'relative';
    style.height = height;
    style.width = '100%';
    return <div style={style}>{wrappedContent}</div>;
  }

  return wrappedContent;
};

export default LoadingBlock;
