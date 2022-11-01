/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

/*!
 * Waves v0.6.4
 * http://fian.my.id/Waves
 *
 * Copyright 2014 Alfiana E. Sibuea and other contributors
 * Released under the MIT license
 * https://github.com/fians/Waves/blob/master/LICENSE
 */

import classnames from 'classnames/bind';
import css from './Waves.scss';
import { window } from '../../common/globals';

const cx = classnames.bind(css);

const theDoc = window.document;

const Waves = {};
let TouchHandler;

const $$ = theDoc.querySelectorAll.bind(theDoc);

function isWindow(obj) {
  return obj !== null && obj === obj.window;
}

function getWindow(elem) {
  return isWindow(elem) ? elem : elem.nodeType === 9 && elem.defaultView;
}

const expander = {
  transform: (styles, value) => {
    styles['-webkit-transform'] = value;
    styles['-moz-transform'] = value;
    styles['-ms-transform'] = value;
    styles['-o-transform'] = value;
  },
  'transition-duration': (styles, value) => {
    styles['-webkit-transition-duration'] = value;
    styles['-moz-transition-duration'] = value;
    styles['-o-transition-duration'] = value;
  },
  'transition-timing-function': (style, value) => {
    style['-webkit-transition-timing-function'] = value;
    style['-moz-transition-timing-function'] = value;
    style['-o-transition-timing-function'] = value;
  },
};

const expandStyles = (styles = {}) => {
  const keys = Object.keys(styles);
  keys.forEach(styleProp => {
    if (expander[styleProp]) {
      expander[styleProp](styles, styles[styleProp]);
    }
  });

  return styles;
};

function offset(elem) {
  let box = { top: 0, left: 0 };
  const doc = elem && elem.ownerDocument;

  const docElem = doc.documentElement;

  if (typeof elem.getBoundingClientRect !== typeof undefined) {
    box = elem.getBoundingClientRect();
  }
  const win = getWindow(doc);
  return {
    top: box.top + win.pageYOffset - docElem.clientTop,
    left: box.left + win.pageXOffset - docElem.clientLeft,
  };
}

function convertStyle(stylesObject) {
  return Object.keys(stylesObject).reduce((textStyle, styleProp) => {
    textStyle += `${styleProp}:${stylesObject[styleProp]};`;
    return textStyle;
  }, '');
}

const Effect = {
  // Effect delay
  duration: 750,
  // eslint-disable-next-line consistent-return
  show(e, element) {
    // Disable right click
    if (e.button === 2) {
      return false;
    }

    const el = element || this;

    // Create ripple
    const ripple = theDoc.createElement('div');
    ripple.className = cx('waves-ripple');
    el.appendChild(ripple);

    // Get click coordinate and element witdh
    const pos = offset(el);
    let relativeY = e.pageY - pos.top;
    let relativeX = e.pageX - pos.left;
    const scale = `scale(${(el.clientWidth / 100) * 10})`;

    // Support for touch devices
    if ('touches' in e) {
      relativeY = e.touches[0].pageY - pos.top;
      relativeX = e.touches[0].pageX - pos.left;
    }

    // Attach data to element
    ripple.setAttribute('data-hold', Date.now());
    ripple.setAttribute('data-scale', scale);
    ripple.setAttribute('data-x', relativeX);
    ripple.setAttribute('data-y', relativeY);

    // Set ripple position
    const rippleStyle = {
      top: `${relativeY}px`,
      left: `${relativeX}px`,
    };

    ripple.className += ` ${cx('waves-notransition')}`;
    ripple.setAttribute('style', convertStyle(rippleStyle));
    ripple.className = ripple.className.replace(cx('waves-notransition'), '');

    // Scale the ripple
    rippleStyle.transform = scale;
    rippleStyle.opacity = '1';
    rippleStyle['transition-duration'] = `${Effect.duration}ms`;
    rippleStyle['transition-timing-function'] = 'cubic-bezier(0.250, 0.460, 0.450, 0.940)';

    ripple.setAttribute('style', convertStyle(expandStyles(rippleStyle)));
  },

  // eslint-disable-next-line consistent-return
  hide(e) {
    TouchHandler.touchup(e);

    const el = this;

    // Get first ripple
    let ripple = null;
    const ripples = el.getElementsByClassName(cx('waves-ripple'));
    if (ripples.length > 0) {
      ripple = ripples[ripples.length - 1];
    } else {
      return false;
    }

    const relativeX = ripple.getAttribute('data-x');
    const relativeY = ripple.getAttribute('data-y');
    const scale = ripple.getAttribute('data-scale');

    // Get delay beetween mousedown and mouse leave
    const diff = Date.now() - Number(ripple.getAttribute('data-hold'));
    let delay = 350 - diff;

    if (delay < 0) {
      delay = 0;
    }

    // Fade out ripple after delay
    setTimeout(() => {
      const style = {
        top: `${relativeY}px`,
        left: `${relativeX}px`,
        opacity: '0',
        'transition-duration': `${Effect.duration}ms`,
        transform: scale,
      };

      ripple.setAttribute('style', convertStyle(expandStyles(style)));

      setTimeout(() => {
        try {
          (ripple.parentElement || el).removeChild(ripple);
        } catch (err) {
          return;
        }
      }, Effect.duration);
    }, delay);
  },

  // Little hack to make <input> can perform waves effect
  wrapInput(elements) {
    for (let a = 0; a < elements.length; a++) {
      const el = elements[a];

      if (el.tagName.toLowerCase() === 'input') {
        const parent = el.parentNode;

        // If input already have parent just pass through
        if (parent.tagName.toLowerCase() === 'i' && parent.className.indexOf(cx('waves-effect')) !== -1) {
          continue; // eslint-disable-line no-continue
        }

        // Put element class and style to the specified parent
        const wrapper = theDoc.createElement('i');
        wrapper.className = `${el.className} ${cx('waves-input-wrapper')}`;

        let elementStyle = el.getAttribute('style');

        if (!elementStyle) {
          elementStyle = '';
        }

        wrapper.setAttribute('style', elementStyle);

        el.className = cx('waves-button-input');
        el.removeAttribute('style');

        // Put element as child
        parent.replaceChild(wrapper, el);
        wrapper.appendChild(el);
      }
    }
  },
};

/**
 * Disable mousedown event for 500ms during and after touch
 */
TouchHandler = {
  /* uses an integer rather than bool so there's no issues with
   * needing to clear timeouts if another touch event occurred
   * within the 500ms. Cannot mouseup between touchstart and
   * touchend, nor in the 500ms after touchend. */
  touches: 0,
  allowEvent(e) {
    let allow = true;

    if (e.type === 'touchstart') {
      TouchHandler.touches += 1; // push
    } else if (e.type === 'touchend' || e.type === 'touchcancel') {
      setTimeout(() => {
        if (TouchHandler.touches > 0) {
          TouchHandler.touches -= 1; // pop after 500ms
        }
      }, 500);
    } else if (e.type === 'mousedown' && TouchHandler.touches > 0) {
      allow = false;
    }

    return allow;
  },
  touchup(e) {
    TouchHandler.allowEvent(e);
  },
};

/**
 * Delegated click handler for .waves-effect element.
 * returns null when .waves-effect element not in "click tree"
 */
function getWavesEffectElement(e) {
  if (TouchHandler.allowEvent(e) === false) {
    return null;
  }

  let element = null;
  let target = e.target || e.srcElement;

  while (target?.parentElement) {
    if ((!(target instanceof SVGElement) && target.className.indexOf(cx('waves-effect')) !== -1) || target?.classList?.contains(cx('waves-effect'))) {
      element = target;
      break;
    }
    target = target.parentElement;
  }

  return element;
}

/**
 * Bubble the click and show effect if .waves-effect elem was found
 */
function showEffect(e) {
  const element = getWavesEffectElement(e);

  if (element !== null) {
    Effect.show(e, element);

    if ('ontouchstart' in window) {
      element.addEventListener('touchend', Effect.hide, false);
      element.addEventListener('touchcancel', Effect.hide, false);
    }

    element.addEventListener('mouseup', Effect.hide, false);
    element.addEventListener('mouseleave', Effect.hide, false);
  }
}

Waves.displayEffect = function displayEffect(options) {
  options = options || {};

  if ('duration' in options) {
    Effect.duration = options.duration;
  }

  // Wrap input inside <i> tag
  Effect.wrapInput($$(`.${cx('waves-effect')}`));

  if ('ontouchstart' in window) {
    theDoc.body.addEventListener('touchstart', showEffect, false);
  }

  theDoc.body.addEventListener('mousedown', showEffect, false);
};

/**
 * Attach Waves to an input element (or any element which doesn't
 * bubble mouseup/mousedown events).
 *   Intended to be used with dynamically loaded forms/inputs, or
 * where the user doesn't want a delegated click handler.
 */
Waves.attach = function attach(element) {
  // FUTURE: automatically add waves classes and allow users
  // to specify them with an options param? Eg. light/classic/button
  if (element.tagName.toLowerCase() === 'input') {
    Effect.wrapInput([element]);
    element = element.parentElement;
  }

  if ('ontouchstart' in window) {
    element.addEventListener('touchstart', showEffect, false);
  }

  element.addEventListener('mousedown', showEffect, false);
};

window.Waves = Waves;

theDoc.addEventListener(
  'DOMContentLoaded',
  () => {
    Waves.displayEffect();
  },
  false,
);

export const getWavesClassName = ({ lighter } = {}) => cx('waves-effect', { 'waves-lighter': lighter });
