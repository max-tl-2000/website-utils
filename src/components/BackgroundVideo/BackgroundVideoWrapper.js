/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

import React, { Component } from 'react';
import { observer } from 'mobx-react';
import classNames from 'classnames/bind';
import SizeAware from '../SizeAware/SizeAware';
import styles from './BackgroundVideo.scss';
import LoadingBlock from '../LoadingBar/LoadingBlock';
import { defaultBreakpointsAsArray } from '../SizeAware/Breakpoints';
import nullish from '../../common/nullish';

const cx = classNames.bind(styles);

@observer
export default class BackgroundVideoWrapper extends Component {
  handleSizeChange = args => {
    const { onSizeChange } = this.props;
    onSizeChange && onSizeChange(args);
  };

  render() {
    const { height, className, model, children, displayLoadingIndicator = false } = this.props;
    const { loading, playerVisible, matches, fallbackImage } = model;
    const style = !nullish(height) ? { height } : {};

    return (
      <SizeAware
        breakpoints={defaultBreakpointsAsArray}
        data-component="bg-video"
        className={cx('background-video', className, { desktop: matches?.large })}
        onSizeChange={this.handleSizeChange}
        style={style}
        onBreakpointChange={model.handleBreakpointChange}>
        {fallbackImage && <div className={cx('fallback')} style={{ backgroundImage: `url(${fallbackImage})` }} />}
        <div className={cx('wrapper', { active: playerVisible })}>{children}</div>
        {displayLoadingIndicator && loading && <LoadingBlock />}
      </SizeAware>
    );
  }
}
