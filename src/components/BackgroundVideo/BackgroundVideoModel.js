/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

import { observable, action, computed, reaction } from 'mobx';
import { getImageForPropertyCarousel } from '../../Website/helpers/images';

const widthsByBreakpoint = {
  xsmall1: 480,
  xsmall2: 600,
  small1: 840,
  small2: 960,
  medium: 1264,
  large: 1680,
  xlarge: 2200,
};

export default class BackgroundVideoModel {
  @observable
  loading = false;

  @observable
  playerVisible = false;

  @observable
  matches = false;

  @observable
  breakpoint;

  @observable
  currentSize;

  @observable
  fallback;

  @observable
  width;

  @observable
  height;

  constructor({ fallback }) {
    this.fallback = fallback;

    reaction(
      () => ({
        breakpoint: this.breakpoint,
      }),
      ({ breakpoint }) => {
        const sizeFound = widthsByBreakpoint[breakpoint]; // average in case of no breakpoint
        if (!this.currentSize || sizeFound > this.currentSize) {
          this.currentSize = sizeFound;
        }
      },
    );
  }

  @action
  setLoading = val => {
    this.loading = val;
  };

  @action
  setSizes = ({ width, height }) => {
    this.width = width;
    this.height = height;
  };

  @action
  showPlayer = () => {
    this.playerVisible = true;
    this.setLoading(false);
  };

  @action
  handleBreakpointChange = ({ matches, breakpoint }) => {
    this.matches = matches;
    this.breakpoint = breakpoint;
  };

  @computed
  get fallbackImage() {
    if (!this.currentSize || !this.fallback) return null;

    return getImageForPropertyCarousel(this.fallback, { width: this.currentSize, maxDPR: 1 });
  }
}
