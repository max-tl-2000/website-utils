/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

import React, { Component } from 'react';
import { observable, computed, action } from 'mobx';
import { observer } from 'mobx-react';
import classnames from 'classnames/bind';

import styles from './Scrollable.scss';
import { getSizeObserver } from '../../common/resize-helper';
import { isNum } from '../../common/type-of';

const cx = classnames.bind(styles);

@observer
export default class Scrollable extends Component {
  @observable
  scrollTop;

  @observable
  scrollLeft;

  @observable
  scrollHeight;

  @observable
  scrollWidth;

  @observable
  clientHeight;

  @observable
  clientWidth;

  @computed
  get topVisible() {
    return this.scrollTop > 0;
  }

  @computed
  get bottomVisible() {
    return this.scrollTop < this.scrollHeight - this.clientHeight;
  }

  @computed
  get leftVisible() {
    return this.scrollLeft > 0;
  }

  @computed
  get rightVisible() {
    return this.scrollLeft < this.scrollWidth - this.clientWidth;
  }

  @action
  updateScrollProps = () => {
    const { scrollableRef } = this;

    if (!scrollableRef) return;

    this.scrollTop = scrollableRef.scrollTop;
    this.scrollLeft = scrollableRef.scrollLeft;

    this.scrollHeight = scrollableRef.scrollHeight;
    this.scrollWidth = scrollableRef.scrollWidth;

    this.clientHeight = scrollableRef.clientHeight;
    this.clientWidth = scrollableRef.clientWidth;
  };

  componentDidMount() {
    if (!this.scrollableRef) return;
    setTimeout(this.updateScrollProps, 16);
  }

  unObserve = () => {
    if (!this.obs) return;

    this.obs.stop();
    this.obs = null;
  };

  get domElement() {
    return this.scrollableRef;
  }

  storeRef = ref => {
    const { scrollableRef } = this;
    if (ref) {
      ref.addEventListener('scroll', this.updateScrollProps);
      this.obs = getSizeObserver(ref, this.updateScrollProps);
    } else {
      scrollableRef && scrollableRef.removeEventListener('scroll', this.updateScrollProps);
      this.unObserve();
    }

    this.scrollableRef = ref;
  };

  render() {
    const { children, height, fixedDimensions, width, xAxis = true, yAxis = true, className, innerClassName, lighter, darker, ...rest } = this.props;
    const style = {};
    const scrollableStyle = {};

    if (isNum(height)) {
      style.height = height;
      if (fixedDimensions) {
        scrollableStyle.height = height;
      }
    }
    if (isNum(width)) {
      style.width = width;
      if (fixedDimensions) {
        scrollableStyle.width = width;
      }
    }

    scrollableStyle.overflowX = xAxis ? 'auto' : 'hidden';
    scrollableStyle.overflowY = yAxis ? 'auto' : 'hidden';

    const { topVisible, leftVisible, bottomVisible, rightVisible } = this;

    return (
      <div style={style} className={cx('viewport', { lighter, darker }, className)} {...rest}>
        <div className={cx('scrollable', innerClassName)} ref={this.storeRef} style={scrollableStyle}>
          {children}
        </div>
        <div className={cx('affordance', 'top', { visible: topVisible })} />
        <div className={cx('affordance', 'left', { visible: leftVisible })} />
        <div className={cx('affordance', 'bottom', { visible: bottomVisible })} />
        <div className={cx('affordance', 'right', { visible: rightVisible })} />
      </div>
    );
  }
}
