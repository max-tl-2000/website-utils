/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

import React from 'react';
import svgs from '@redisrupt/red-svg-icons';
import classNames from 'classnames/bind';
import styles from './SvgIcon.scss';

const cx = classNames.bind(styles);

export const SvgIcon = ({ category, name = '', className }) => {
  if (!category) {
    const nameParts = name.split(':');
    name = nameParts[1];
    category = nameParts[0];
  }
  const svgPath = svgs?.[category]?.[name];
  if (!svgPath) {
    return (
      <svg
        data-component="svg-icon"
        className={cx('svg-icon', className)}
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink">
        <g>
          <path d="M12,2C6.5,2,2,6.5,2,12s4.5,10,10,10s10-4.5,10-10S17.5,2,12,2z M17,13H7v-2h2h1l0,0l0,0l0,0h2.8H14h1h2l0,0" />
        </g>
      </svg>
    );
  }
  return (
    <svg
      data-component="svg-icon"
      className={cx('svg-icon', className)}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink">
      <g dangerouslySetInnerHTML={{ __html: svgPath }} />
    </svg>
  );
};
