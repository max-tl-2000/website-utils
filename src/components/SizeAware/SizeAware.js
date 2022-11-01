/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

import React, { Component } from 'react';
import { observable, action } from 'mobx';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { getSizeObserver } from '../../common/resize-helper';
import { matchBreakpoints } from '../../common/match-breakpoints';
import { isHidden } from '../../common/dom';

@observer
export default class SizeAware extends Component {
  static propTypes = {
    skipRenderIfHidden: PropTypes.bool,
  };

  static defaultProps = {
    skipRenderIfHidden: true,
  };

  @observable
  breakpoint = '';

  @observable.shallow
  matches = {};

  @observable.shallow
  rect = {};

  storeRef = ref => {
    this.ref = ref;
  };

  destroyResizeObserver = () => {
    this.obs.stop();
  };

  createResizeObserver = () => {
    this.obs = getSizeObserver(this.ref, this.handleResize);
  };

  @action
  _processBreakpoints(rect) {
    const { props } = this;
    const { breakpoints, onSizeChange, onBreakpointChange } = props;

    onSizeChange && onSizeChange(rect);

    const lastBreakpoint = this.breakpoint;
    const { currentBreakpoint, matches } = matchBreakpoints(breakpoints, rect.width);

    if (currentBreakpoint && lastBreakpoint && currentBreakpoint === lastBreakpoint) return;

    this.breakpoint = currentBreakpoint;
    this.matches = matches;

    const { width, height } = rect;

    this.rect = { width, height };

    onBreakpointChange && onBreakpointChange({ ...this.rect, breakpoint: currentBreakpoint, matches });
  }

  @action
  checkSize = () => {
    const { ref } = this;
    if (!ref) return;

    if (isHidden(ref)) {
      return;
    }

    const rect = ref.getBoundingClientRect();

    this._processBreakpoints(rect);
  };

  handleResize = () => {
    this.checkSize();
  };

  @action
  componentDidMount() {
    this.wrapperMounted = true;
    this.createResizeObserver();
    this.checkSize();
  }

  componentWillUnmount() {
    this.destroyResizeObserver();
  }

  render() {
    const { children, onSizeChange, onBreakpointChange, breakpoints, skipRenderIfHidden, ...rest } = this.props;
    const { rect, matches, breakpoint, wrapperMounted } = this;

    let content;
    if (wrapperMounted || !skipRenderIfHidden) {
      content = typeof children === 'function' ? children({ ...rect, breakpoint, matches }) : children;
    }

    return (
      <div ref={this.storeRef} {...rest}>
        {content}
      </div>
    );
  }
}
