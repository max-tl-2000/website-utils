/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import classnames from 'classnames/bind';
import styles from './SimpleDialog.scss';
import Button from '../Button/Button';
import { trans } from '../../common/trans';
import Revealer from '../Revealer/Revealer';
import Portal from '../Portal/Portal';
import IconButton from '../IconButton/IconButton';
import CloseIcon from './CloseIcon.svg';

const cx = classnames.bind(styles);
@observer
export default class SimpleDialog extends Component {
  static propTypes = {
    closeOnEscape: PropTypes.bool,
  };

  static defaultProps = {
    closeOnEscape: true,
  };

  checkIfCloseIsNeeded = e => {
    const { onCloseRequest } = this.props;
    if (this.overlayRef && e.target === this.overlayRef) {
      onCloseRequest && onCloseRequest({ source: 'clickOutside' });
    }
  };

  storeOveralyRef = ref => {
    this.overlayRef = ref;
  };

  handleClose = params => {
    this.cancelPreventScroll();

    const { onBtnClick, onCloseRequest } = this.props;
    const source = params?.source;

    const args = {
      autoClose: true,
      source,
      performClose: () => {
        onCloseRequest && onCloseRequest({ source });
      },
    };

    if (onBtnClick) {
      onBtnClick(args);
    }

    if (!args.autoClose) return;
    args.performClose();
  };

  handleEscapeKeyPressed = e => {
    const { open } = this.props;
    if (!open) return;

    if (e.keyCode === 27) {
      this.handleClose({ source: 'escapeKey' });
    }
  };

  componentDidMount() {
    const { closeOnEscape } = this.props;
    closeOnEscape && document.addEventListener('keydown', this.handleEscapeKeyPressed, false);
  }

  componentWillUnmount() {
    const { closeOnEscape } = this.props;
    closeOnEscape && document.removeEventListener('keydown', this.handleEscapeKeyPressed, false);
  }

  preventBodyScroll = () => {
    const { scrollingEle = document.body } = this.props;
    scrollingEle.classList.add(cx('preventScroll'));
  };

  handleExit = () => {
    this.cancelPreventScroll();
    const { onClosed } = this.props;
    onClosed && onClosed();
  };

  handleOnEnter = () => {
    this.preventBodyScroll();
    const { onOpen } = this.props;
    onOpen && onOpen();
  };

  cancelPreventScroll = () => {
    const { scrollingEle = document.body } = this.props;
    scrollingEle.classList.remove(cx('preventScroll'));
  };

  render() {
    const {
      open,
      children,
      className,
      dlgBodyClassName,
      renderButton = true,
      dlgClassName,
      btnLabel = trans('CLOSE', 'Close'),
      btnDisabled,
      dlgWrapperClassName,
      showCloseAction,
      dataId,
      onEnterStart,
    } = this.props;

    return (
      <Portal>
        <Revealer className={className} show={open} onEnterStart={onEnterStart} onEnter={this.handleOnEnter} onExit={this.handleExit}>
          {() => (
            <div className={cx('dialog', dlgClassName)}>
              <div ref={this.storeOveralyRef} className={cx('overlay')} onClick={this.checkIfCloseIsNeeded}>
                <div className={cx('dialogBody', { renderButton }, dlgBodyClassName)} data-id={dataId}>
                  <div className={cx('wrapper', dlgWrapperClassName)}>{typeof children === 'function' ? children() : children}</div>
                  {renderButton && (
                    <Button
                      className={cx('btnClose')}
                      type="flat"
                      btnRole="secondary"
                      disabled={btnDisabled}
                      label={btnLabel}
                      onClick={() => this.handleClose({ source: 'closeButton' })}
                    />
                  )}
                  {showCloseAction && (
                    <IconButton type="flat" className={cx('closeAction')} icon={CloseIcon} onClick={() => this.handleClose({ source: 'closeIcon' })} />
                  )}
                </div>
              </div>
            </div>
          )}
        </Revealer>
      </Portal>
    );
  }
}
