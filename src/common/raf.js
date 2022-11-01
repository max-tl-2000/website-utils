/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

// How to figure out what a user's computer can handle for frames with fallbacks
// Original by Paul Irish: http://paulirish.com/2011/requestanimationframe-for-smart-animating/
export const raf =
  global.requestAnimationFrame ||
  global.webkitRequestAnimationFrame ||
  global.mozRequestAnimationFrame ||
  global.oRequestAnimationFrame ||
  global.msRequestAnimationFrame ||
  (callback => setTimeout(callback, 1000 / 60));

export const cancelRaf = global.cancelAnimationFrame || global.mozCancelAnimationFrame || (req => clearTimeout(req));
