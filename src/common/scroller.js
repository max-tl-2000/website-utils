/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

import { doTween } from './simple-tween';

export class Scroller {
  constructor(ele, { axis = 'x', snapSize = 100 } = {}) {
    this.ele = ele;
    this.axis = axis;
    this.animating = false;

    const isXAxis = axis === 'x';

    this.scrollProp = isXAxis ? 'scrollLeft' : 'scrollTop';
    this.offsetDimensionProp = isXAxis ? 'offsetWidth' : 'offsetHeight';
    this.clientDimensionProp = isXAxis ? 'clientWidth' : 'clientHeight';
    this.scrollDimensionProp = isXAxis ? 'scrollWidth' : 'scrollHeight';
    this.snapSize = snapSize;

    ele.addEventListener('scroll', this.scrollHandler);
  }

  updateSnapSize = snapSize => {
    this.snapSize = snapSize;
  };

  cancelAnimation = () => {
    const { tween, animating, ele, wheelEvent } = this;
    ele.removeEventListener(wheelEvent, this.cancelAnimation);
    if (!animating) return;
    tween && tween.cancel();
  };

  scrollHandler = e => {
    const { timer, _scrollEnd } = this;
    clearTimeout(timer);

    this.timer = setTimeout(() => _scrollEnd(e), 100);
  };

  _scrollEnd = () => {
    const { scrollPos, snapSize } = this;
    const nextPos = Math.round(scrollPos / snapSize) * snapSize;

    this.scrollToPos(nextPos);
  };

  get maxScrollPos() {
    const { ele, scrollDimensionProp, clientDimensionProp } = this;

    const scrollDimension = ele[scrollDimensionProp];
    const clientDimension = ele[clientDimensionProp];

    return scrollDimension - clientDimension;
  }

  moveNext() {
    const { scrollPos, snapSize } = this;
    const currentPos = Math.round(scrollPos / snapSize) * snapSize;
    const nextPos = Math.round(currentPos + snapSize);
    this.scrollToPos(nextPos);
  }

  movePrev() {
    const { scrollPos, snapSize } = this;
    const currentPos = Math.round(scrollPos / snapSize) * snapSize;
    const nextPos = Math.round(currentPos - snapSize);
    this.scrollToPos(nextPos);
  }

  destroy() {
    const { ele, scrollHandler } = this;
    if (!ele) return;
    ele.removeEventListener('scroll', scrollHandler);

    this.ele = null;
  }

  get scrollPos() {
    const { scrollProp, ele } = this;
    return ele[scrollProp];
  }

  set scrollPos(value) {
    const { scrollProp, ele, maxScrollPos } = this;

    if (value < 0) {
      value = 0;
    }

    if (value > maxScrollPos) {
      value = maxScrollPos;
    }

    ele[scrollProp] = value;
  }

  tick = ({ v }) => {
    this.scrollPos = v;
  };

  async scrollToPos(pos, duration = 350) {
    const { tween, maxScrollPos, scrollPos } = this;

    if (pos < 0) {
      pos = 0;
    }

    if (pos > maxScrollPos) {
      pos = maxScrollPos;
    }

    if (scrollPos === pos) return; // no need to animate anything

    if (tween) {
      tween.cancel();
    }

    this.tween = doTween({ startValue: scrollPos, endValue: pos, duration, tick: this.tick });

    this.animating = true;
    await this.tween;
    this.animating = false;
  }
}
