/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

import React, { Component } from 'react';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';

@observer
export default class Panel extends Component {
  static propTypes = {
    enterClass: PropTypes.string,
    exitClass: PropTypes.string,
    onEnterDone: PropTypes.func,
    onExitDone: PropTypes.func,
  };

  storeRef = ref => {
    this.ref = ref;
  };

  get DOMNode() {
    return this.ref;
  }

  exit() {
    const { enterClass, exitClass, onExitStart, enterDoneClass } = this.props;

    if (!exitClass) {
      throw new Error('No exitClass prop defined');
    }

    this.clearHandlers();

    const { ref } = this;

    ref.addEventListener('animationend', this._handleExitAnimationEnd);
    ref.addEventListener('transitionend', this._handleExitAnimationEnd);

    const THRESHOLD_TO_FIRE_FALLBACK = 1000;
    this.exitFallbackTimeout = setTimeout(this._handleExitAnimationEndFallback, THRESHOLD_TO_FIRE_FALLBACK);

    enterDoneClass && ref.classList.remove(enterDoneClass);
    enterClass && ref.classList.remove(enterClass);

    ref.classList.add(exitClass);

    onExitStart && setTimeout(onExitStart, 0);
  }

  _handleExitAnimationEnd = ({ target }) => {
    const { ref } = this;
    if (target !== ref) return;

    clearTimeout(this.exitFallbackTimeout);

    this._handleExit(ref);
  };

  _handleExitAnimationEndFallback = () => {
    const { ref } = this;
    if (!ref || this._unmount) {
      return;
    }

    this._handleExit(ref);
  };

  _handleExit(ref) {
    const { onExitDone, exitClass } = this.props;
    ref.removeEventListener('animationend', this._handleExitAnimationEnd);
    ref.removeEventListener('transitionend', this._handleExitAnimationEnd);
    ref.classList.remove(exitClass);
    onExitDone && onExitDone();
  }

  clearHandlers() {
    const { ref } = this;

    const { enterClass, exitClass } = this.props;
    exitClass && ref.classList.remove(exitClass);
    enterClass && ref.classList.remove(enterClass);

    ref.removeEventListener('animationend', this._handleExitAnimationEnd);
    ref.removeEventListener('transitionend', this._handleExitAnimationEnd);

    ref.removeEventListener('animationend', this._handleEnterAnimationEnd);
    ref.removeEventListener('transitionend', this._handleEnterAnimationEnd);
    this._unmount = true;
  }

  componentWillUnmount() {
    this.clearHandlers();
  }

  // TODO: migrate to componentDidUpdate as componentWillReceiveProps is deprecated
  UNSAFE_componentWillReceiveProps(nextProps) {
    const currentProps = this.props;

    if (!currentProps.show && nextProps.show) {
      this.clearHandlers();
      this.playEnterAnimation();
    }
  }

  componentDidMount() {
    this.playEnterAnimation();
  }

  playEnterAnimation() {
    const { enterClass, onEnterStart, exitClass, skipFirst } = this.props;
    const { ref } = this;

    if (skipFirst) {
      exitClass && ref.classList.remove(exitClass);
      return;
    }

    if (!enterClass) {
      throw new Error('No enterClass prop defined');
    }

    ref.addEventListener('animationend', this._handleEnterAnimationEnd);
    ref.addEventListener('transitionend', this._handleEnterAnimationEnd);

    const THRESHOLD_TO_FIRE_FALLBACK = 1000;
    this.enterFallbackTimeout = setTimeout(this._handleEnterAnimationEndFallback, THRESHOLD_TO_FIRE_FALLBACK);

    exitClass && ref.classList.remove(exitClass);
    ref.classList.add(enterClass);

    onEnterStart && setTimeout(onEnterStart, 0);
  }

  _handleEnterAnimationEnd = ({ target }) => {
    const { ref } = this;

    if (target !== ref) return;

    clearTimeout(this.enterFallbackTimeout);

    this._handleEnter(ref);
  };

  _handleEnterAnimationEndFallback = () => {
    const { ref, props } = this;

    if (!ref || this._unmount) return;

    const { enterClass, onEnterDone, enterDoneClass } = props;

    ref.removeEventListener('animationend', this._handleEnterAnimationEnd);
    ref.classList.remove(enterClass);

    enterDoneClass && ref.classList.add(enterDoneClass);
    onEnterDone && onEnterDone();
  };

  _handleEnter(ref) {
    const { props } = this;
    const { enterClass, onEnterDone, enterDoneClass } = props;

    ref.removeEventListener('animationend', this._handleEnterAnimationEnd);
    ref.classList.remove(enterClass);

    enterDoneClass && ref.classList.add(enterDoneClass);
    onEnterDone && onEnterDone();
  }

  render() {
    const {
      children,
      show,
      exitClass,
      enterClass,
      enterDoneClass,
      onEnterDone,
      onExitStart,
      onEnterStart,
      onEnter,
      onExit,
      onExitDone,
      skipFirst,
      ...rest
    } = this.props;
    return (
      <div ref={this.storeRef} {...rest}>
        {children}
      </div>
    );
  }
}
