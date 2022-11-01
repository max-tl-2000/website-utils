/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

import { deferred } from '../../common/deferred';

export const imgToDataURL = async (img, { type = 'image/png', encoderOptions } = {}) => {
  const d = deferred();

  const NEXT_FRAME_THRESHOLD = 16;
  setTimeout(() => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    canvas.width = img.width;
    canvas.height = img.height;

    ctx.drawImage(img, 0, 0);
    const data = canvas.toDataURL(type, encoderOptions);
    d.resolve(data);
  }, NEXT_FRAME_THRESHOLD);

  return d;
};

export const Image = window.Image;
