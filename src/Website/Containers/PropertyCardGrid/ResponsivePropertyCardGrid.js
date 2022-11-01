/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { observable, action, computed } from 'mobx';
import clsc from 'coalescy';

import SizeAware from '../../../components/SizeAware/SizeAware';
import PropertyCardGrid from './PropertyCardGrid';

@observer
export default class ResponsivePropertyCardGrid extends Component {
  @observable
  containerWidth;

  @action
  handleSizeChange = ({ width }) => {
    this.containerWidth = width;
  };

  @computed
  get columns() {
    const { containerWidth, props } = this;
    if (!containerWidth) return 1;
    const { minCardWidth = 300 } = props;
    return Math.floor(containerWidth / minCardWidth);
  }

  render() {
    const { gutter = 16, verticalGutter = 16, cols, ...rest } = this.props;
    return (
      <SizeAware onSizeChange={this.handleSizeChange}>
        <PropertyCardGrid cols={clsc(cols, this.columns)} gutter={gutter} verticalGutter={verticalGutter} {...rest} />
      </SizeAware>
    );
  }
}
