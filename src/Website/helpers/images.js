/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

import nullish from '../../common/nullish';
import { getUrlFromCloudinary } from './cloudinary';

const getImage = (imageUrl, { width, height, radius, format = 'auto', maxDPR } = {}) => {
  let widthParam = '';
  let heightParam = '';
  let radiustParam = '';
  let formatParam = '';

  if (!nullish(width)) {
    widthParam = `w_${Math.floor(width)}`;
  }

  if (!nullish(height)) {
    heightParam = `h_${Math.floor(height)}`;
  }

  if (!nullish(radius)) {
    radiustParam = `r_${radius}`;
  }

  if (format) {
    formatParam = `f_${format}`;
  }

  return getUrlFromCloudinary(imageUrl, {
    cloudinaryParams: [
      widthParam,
      heightParam,
      radiustParam,
      formatParam,
      'c_fill',
      'q_auto:best',
      'g_auto:no_faces',
      'e_improve',
      'e_auto_brightness',
      'fl_force_strip',
    ],
    maxDPR,
  });
};

export const getImageForInventoryCarousel = (imageUrl, { height = 445, radius, ...args } = {}) => getImage(imageUrl, { height, radius, ...args });

export const getImageForPropertyCarousel = (imageUrl, { width = 1680, ...args } = {}) => getImage(imageUrl, { width, ...args });

export const getLayoutImage = (imageUrl, { height = 660, radius = 5, ...args } = {}) => getImage(imageUrl, { height, radius, ...args });

export const getUnitTypeImage = (imageUrl, { height = 277, radius = 5, ...args } = {}) => getImage(imageUrl, { height, radius, ...args });

export const getPropertyCardImage = (imageUrl, { width = 400, height = 300, ...args } = {}) => getImage(imageUrl, { width, height, ...args });

export const getCloudinaryURLForImage = (...args) => getImage(...args);
