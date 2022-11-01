/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

import { raf, cancelRaf } from './raf';
import { deferred } from './deferred';
import { sineOut } from './ease-fns';

/**
 * Desc.
 * @author Ash Blue
 * @link http://blueashes.com
 * @todo Include instructions to replace Date.now() with your game loop's time
 * time to make things more accurate
 * @todo Can the tween methods not be prototypes so they're static?
 */

const round = num => Math.round(num * 100) / 100;

/**
 * Constructor for the tween
 * @param {number} startValue What value does the tween start at
 * @param {number} distance How far does the tween's value advance from the startValue?
 * @param {number} duration Amount of time in milliseconds the tween runs for
 * @param {string} easing What easing function should be used from the easing library?
 * See _easingLibrary for a list of potential easing equations.
 * @param {string} loop Can be left blank, set to loop, or repeat. Loop repeats repeats the animation
 * in reverse every time. Repeat will run the original tween from the beginning
 * @returns {self}
 */
export class Tween {
  constructor({ startValue, distance, duration, easing = sineOut, loop } = {}) {
    this.startTime = Date.now();
    this.startValue = startValue;
    this.distance = distance;
    this.duration = duration;
    this.loop = loop;

    this.animationFn = easing;
  }

  getValue() {
    let total;

    const { expired, startTime, startValue, distance, duration, animationFn, loop } = this;

    if (!expired) {
      total = animationFn(Date.now() - startTime, startValue, distance, duration);

      // Ended and no repeat is present
    } else if (!loop) {
      total = startValue + distance;

      // Calculate time passed and restart repeat
    } else if (loop === 'repeat') {
      this.startTime = Date.now();

      total = animationFn(Date.now() - startTime, startValue, distance, duration);

      // Run a looped repeat in reverse
    } else {
      const _startValue = (this.startValue = startValue + distance);
      const _distance = (this.distance = -distance);
      const _startTime = (this.startTime = Date.now());

      total = animationFn(Date.now() - _startTime, _startValue, _distance, duration);
    }

    return round(total);
  }

  get expired() {
    const { startTime, duration } = this;
    return startTime + duration < Date.now();
  }
}

export const doTween = ({ startValue, endValue, duration, easing = sineOut, loop, tick, complete, cancel }) => {
  const dfd = deferred();
  const tween = new Tween({ startValue, distance: endValue - startValue, duration, easing, loop });
  let req;
  let canceled;

  const process = () => {
    if (canceled) {
      cancelRaf(req);
      dfd.resolve();
      cancel && cancel();
      return;
    }

    if (tween.expired) {
      cancelRaf(req);
      tick && tick({ v: endValue });
      complete && complete();
      dfd.resolve();
      return;
    }

    tick && tick({ v: tween.getValue(), tween });
    req = raf(process);
  };

  req = raf(process);

  dfd.cancel = () => {
    canceled = true;
    cancelRaf(req);
  };

  return dfd;
};
