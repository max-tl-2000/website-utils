/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

import React, { Component } from 'react';
import { observer } from 'mobx-react';
import memoize from 'lodash/memoize';
import Carousel from '../../../components/Carousel/Carousel';
import { getImageForPropertyCarousel } from '../../helpers/images';
import { defaultBreakpointsAsArray } from '../../../components/SizeAware/Breakpoints';
import SizeAware from '../../../components/SizeAware/SizeAware';

const widthsByBreakpoint = {
  xsmall1: 480,
  xsmall2: 600,
  small1: 840,
  small2: 960,
  medium: 1264,
  large: 1680,
  xlarge: 2200,
};

@observer
export default class CarouselWidget extends Component {
  /**
   * return the desired width for a given breakpoint. If the new width found is not bigger than the previous
   * one just return the previous one. This means that if we ever fetched an image for a bigger width and we
   * then decided to reduce the container size (i.e.: by resizing window) we won't do another request since
   * we already have a higher quality image.
   *
   * On the other hand if we resize from a smaller width to a bigger width, then we will want to honor the new
   * width, since the image that we will obtain will have better image quality
   */
  getDesiredWidthForGivenBreakpoint = breakpoint => {
    const sizeFound = widthsByBreakpoint[breakpoint] || 960; // average in case of no breakpoint
    if (!this.currentSize || sizeFound > this.currentSize) {
      this.currentSize = sizeFound;
    }

    return this.currentSize;
  };

  /**
   * retrieves the best images for a given width. It remembers if already calculated the best images for a given set of pictures
   * and a given width. This is done to prevent forcing a render due to a new array being calculated on every width change
   */
  getBestImagesForGivenWidth = memoize(
    (pictures, width) =>
      (pictures || []).map(img => ({
        source: getImageForPropertyCarousel(img.source, { width }),
      })),
    (pictures, width) => {
      if (!this._cacheKey || pictures !== this._cacheKey.pictures || width !== this._cacheKey.width) {
        this._cacheKey = { pictures, width };
      }

      return this._cacheKey;
    },
  );

  getBestPicturesForGivenBreakpoint = (pictures, breakpoint) => {
    const width = this.getDesiredWidthForGivenBreakpoint(breakpoint);
    return this.getBestImagesForGivenWidth(pictures, width);
  };

  render() {
    const { pictures, videos, tours, bgVideo } = this.props;
    return (
      <SizeAware breakpoints={defaultBreakpointsAsArray}>
        {({ matches, breakpoint }) => {
          // if background video is present we ignore the pictures
          const thePictures = bgVideo ? undefined : this.getBestPicturesForGivenBreakpoint(pictures, breakpoint);
          return (
            <Carousel height={matches.large ? 660 : 400} pictures={thePictures} videos={videos} tours={tours} bgVideo={bgVideo} noBtnLabels={!matches.medium} />
          );
        }}
      </SizeAware>
    );
  }
}
