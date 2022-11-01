/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

import React from 'react';

const defaultColor = '#333';
const dimensions = {
  width: 20,
  height: 16,
};

const LoadingBars = ({ color, width, height, className, style }) => (
  <svg style={style} className={className} xmlns="http://www.w3.org/2000/svg" x="0" y="0" width={width} height={height} viewBox="0 0 20 24">
    <rect x="0" y="10" width="4" height="10" fill={color} opacity="0.2">
      <animate attributeName="opacity" attributeType="XML" values="0.2; 1; .2" begin="0s" dur="0.6s" repeatCount="indefinite" />
      <animate attributeName="height" attributeType="XML" values="10; 20; 10" begin="0s" dur="0.6s" repeatCount="indefinite" />
      <animate attributeName="y" attributeType="XML" values="10; 5; 10" begin="0s" dur="0.6s" repeatCount="indefinite" />
    </rect>
    <rect x="8" y="10" width="4" height="10" fill={color} opacity="0.2">
      <animate attributeName="opacity" attributeType="XML" values="0.2; 1; .2" begin="0.15s" dur="0.6s" repeatCount="indefinite" />
      <animate attributeName="height" attributeType="XML" values="10; 20; 10" begin="0.15s" dur="0.6s" repeatCount="indefinite" />
      <animate attributeName="y" attributeType="XML" values="10; 5; 10" begin="0.15s" dur="0.6s" repeatCount="indefinite" />
    </rect>
    <rect x="16" y="10" width="4" height="10" fill={color} opacity="0.2">
      <animate attributeName="opacity" attributeType="XML" values="0.2; 1; .2" begin="0.3s" dur="0.6s" repeatCount="indefinite" />
      <animate attributeName="height" attributeType="XML" values="10; 20; 10" begin="0.3s" dur="0.6s" repeatCount="indefinite" />
      <animate attributeName="y" attributeType="XML" values="10; 5; 10" begin="0.3s" dur="0.6s" repeatCount="indefinite" />
    </rect>
  </svg>
);

LoadingBars.defaultProps = {
  color: defaultColor,
  width: dimensions.width,
  height: dimensions.height,
};

export default LoadingBars;
