/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

import React, { Component } from 'react';
import { observable, action } from 'mobx';
import { observer } from 'mobx-react';
import classnames from 'classnames/bind';

import Panel from './Panel';
import styles from './Revealer.scss';

const cx = classnames.bind(styles);

@observer
export default class Revealer extends Component {
  @observable
  showing = false;

  @observable
  count = 0;

  storeRef = ref => {
    this.ref = ref;
  };

  get DOMNode() {
    return (this.ref || {}).DOMNode;
  }

  @action
  setShowingValue(showing) {
    this.showing = showing;
    if (this.count > 1) return;
    this.count++;
  }

  handleExit = () => {
    this.setShowingValue(false);

    const { onExit } = this.props;
    onExit && onExit();
  };

  handleEnter = () => {
    const { onEnter } = this.props;
    onEnter && onEnter();
  };

  handleClickOutside = e => {
    const { closeOnTapAway, onCloseRequest, onTapAway } = this.props;
    if (this.DOMNode && closeOnTapAway && !this.DOMNode.contains(e.target)) {
      const args = { cancel: false, target: e.target };
      if (onTapAway) {
        onTapAway && onTapAway(args);
        if (args.cancel) return;
      }

      onCloseRequest && onCloseRequest();
    }
  };

  handleEscapeKey = e => {
    const { show, onCloseRequest } = this.props;
    if (e.key === 'Escape' && show) {
      onCloseRequest && onCloseRequest();
    }
  };

  componentWillUnmount() {
    document.removeEventListener('click', this.handleClickOutside, true);
    document.removeEventListener('click', this.handleEscapeKey, true);
  }

  componentDidUpdate(prevProps) {
    if (!this.props.show && prevProps.show) {
      this.ref && this.ref.exit && this.ref.exit();
      return;
    }
    if (this.props.show && !prevProps.show) {
      this.setShowingValue(true);
    }
  }

  componentDidMount() {
    const { show } = this.props;
    if (show) {
      this.setShowingValue(true);
    }

    document.addEventListener('click', this.handleClickOutside, true);
    document.addEventListener('keyup', this.handleEscapeKey, true);
  }

  render() {
    const { showing, count, storeRef, handleEnter, handleExit } = this;
    const {
      children,
      show,
      exitClass,
      enterClass,
      enterDoneClass,
      onExitStart,
      onEnterStart,
      closeOnTapAway,
      onCloseRequest,
      skipFirst,
      onTapAway,
      ...rest
    } = this.props;

    return showing ? (
      <Panel
        {...rest}
        show={show}
        ref={storeRef}
        exitClass={exitClass || cx('exit')}
        enterClass={enterClass || cx('enter')}
        enterDoneClass={enterDoneClass}
        skipFirst={skipFirst && count === 1}
        onEnterStart={onEnterStart}
        onExitStart={onExitStart}
        onEnterDone={handleEnter}
        onExitDone={handleExit}>
        {typeof children === 'function' ? children() : children}
      </Panel>
    ) : null;
  }
}
