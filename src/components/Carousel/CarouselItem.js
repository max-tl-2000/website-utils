/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

import React, { Component } from 'react';
import { observable, action } from 'mobx';
import { observer } from 'mobx-react';
import classNames from 'classnames/bind';
import LoadingBlock from '../LoadingBar/LoadingBlock';

import styles from './CarouselItem.scss';

const cx = classNames.bind(styles);

@observer
export class CarouselItem extends Component {
  @observable
  shouldRender;

  constructor(props) {
    super(props);

    if (props.shouldRender) {
      if (props.index !== 1) {
        this.setShouldRender(props.shouldRender);
      } else {
        const THRESHOLD_TO_RENDER_SECOND_ITEM = 3000;
        this.timer = setTimeout(() => this.setShouldRender(true), THRESHOLD_TO_RENDER_SECOND_ITEM);
      }
    }
  }

  @action
  setShouldRender(shouldRender) {
    this.shouldRender = shouldRender;
  }

  componentDidUpdate() {
    const { index, selected, shouldRender } = this.props;
    if (this.shouldRender) return;

    if (index === 1 && !this.shouldRender) {
      clearTimeout(this.timer);
    }

    if ((shouldRender || selected) && !this.shouldRender) {
      this.setShouldRender(true);
    }
  }

  render() {
    const { children, className, style } = this.props;

    return (
      <div className={cx('CarouselItem', className)} style={style}>
        {!this.shouldRender ? <LoadingBlock /> : children}
      </div>
    );
  }
}
