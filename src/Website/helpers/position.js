/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

import { window } from '../../common/globals';

export const ensureInsideViewport = ({ top = 0, left = 0, overlayRect, keepInsideViewport = true }) => {
  const { height: overlayHeight, width: overlayWidth } = overlayRect;

  const screenHeight = window.innerHeight;
  const screenWidth = window.innerWidth;

  const bottom = top + overlayHeight;
  const right = left + overlayWidth;

  top = bottom > screenHeight && keepInsideViewport ? top - (bottom - screenHeight) : top;
  left = right > screenWidth && keepInsideViewport ? left - (right - screenWidth) : left;

  top = top < 0 && keepInsideViewport ? 0 : top;
  left = left < 0 && keepInsideViewport ? 0 : left;

  return { top, left };
};

export const position = (element, options = {}) => {
  const { my = 'center bottom', at = 'center top', of: target, offset = { left: 0, top: 0 }, keepInsideViewport = true } = options;

  if (!target) return null;

  const overlayRect = element.getBoundingClientRect();
  const targetRect = target.getBoundingClientRect();

  if (my === 'left top' && at === 'right top') {
    const { top, right } = targetRect;

    const { top: newTop, left: newLeft } = ensureInsideViewport({
      top: top + offset.top,
      left: right + offset.left,
      overlayRect,
      keepInsideViewport,
    });

    return {
      top: newTop,
      left: newLeft,
    };
  }

  if (my === 'right top' && at === 'left top') {
    const { top, left } = targetRect;

    const { top: newTop, left: newLeft } = ensureInsideViewport({
      top: top + offset.top,
      left: left - overlayRect.width + offset.left,
      overlayRect,
      keepInsideViewport,
    });

    return {
      top: newTop,
      left: newLeft,
    };
  }

  if (my === 'left top' && at === 'center top') {
    const { top, left } = targetRect;
    const { top: newTop, left: newLeft } = ensureInsideViewport({
      top: top + offset.top,
      left: left + targetRect.width / 2 + offset.left,
      overlayRect,
      keepInsideViewport,
    });

    return {
      top: newTop,
      left: newLeft,
    };
  }

  if (my === 'left top' && at === 'left top') {
    const { top, left } = targetRect;
    const { top: newTop, left: newLeft } = ensureInsideViewport({
      top: top + offset.top,
      left: left + offset.left,
      overlayRect,
      keepInsideViewport,
    });

    return {
      top: newTop,
      left: newLeft,
    };
  }

  if (my === 'center top' && at === 'center top') {
    const { top, left } = targetRect;
    const { top: newTop, left: newLeft } = ensureInsideViewport({
      top: top + offset.top,
      left: left + targetRect.width / 2 - overlayRect.width / 2 + offset.left,
      overlayRect,
      keepInsideViewport,
    });

    return {
      top: newTop,
      left: newLeft,
    };
  }

  if (my === 'center top' && at === 'center bottom') {
    const { bottom, left } = targetRect;
    const { top: newTop, left: newLeft } = ensureInsideViewport({
      top: bottom + offset.top,
      left: left + targetRect.width / 2 - overlayRect.width / 2 + offset.left,
      overlayRect,
      keepInsideViewport,
    });

    return {
      top: newTop,
      left: newLeft,
    };
  }

  if (my === 'left top' && at === 'left bottom') {
    const { bottom, left } = targetRect;
    const { top: newTop, left: newLeft } = ensureInsideViewport({
      top: bottom + offset.top,
      left: left + offset.left,
      overlayRect,
      keepInsideViewport,
    });

    return {
      top: newTop,
      left: newLeft,
    };
  }

  if (my === 'center bottom' && at === 'center top') {
    const { top, left } = targetRect;
    const { top: newTop, left: newLeft } = ensureInsideViewport({
      top: top - overlayRect.height + offset.top,
      left: left + targetRect.width / 2 - overlayRect.width / 2 + offset.left,
      overlayRect,
      keepInsideViewport,
    });

    return {
      top: newTop,
      left: newLeft,
    };
  }

  return null;
};
