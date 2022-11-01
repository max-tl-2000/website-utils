/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

import React, { Component } from 'react';
import classnames from 'classnames/bind';
import debounce from 'debouncy';
import styles from './Button.scss';
import { getWavesClassName } from '../Waves/Waves';
import LoaderIndicator from '../LoaderIndicator/LoaderIndicator';

const cx = classnames.bind(styles);

export default class Button extends Component {
  handleClick = e => {
    const { props } = this;

    if (props.debounceClick) {
      this.debounceFireClick(e);
      return;
    }

    this.fireClick(e);
  };

  fireClick(e) {
    const { onClick, disabled, loading } = this.props;

    if (disabled || loading) {
      return;
    }

    onClick && onClick(e);
  }

  debounceFireClick = debounce(this.fireClick, this.props.debounceClickThreshold, this, true /* immediate */);

  static defaultProps = {
    debounceClick: true,
    debounceClickThreshold: 400,
  };

  render() {
    const {
      onClick,
      type = 'raised',
      btnRole = 'primary',
      big,
      wide,
      className,
      wavesLighter,
      label,
      children,
      disabled,
      loading,
      uppercase = true,
      loaderStyle,
      debounceClick,
      debounceClickThreshold,
      ...rest
    } = this.props;

    const content = label ? <span className={cx('label')}>{label}</span> : children;

    let loadingC;
    if (loading) {
      let darkerMode;

      if (!loaderStyle) {
        darkerMode = type === 'flat' || btnRole === 'secondary';
      } else {
        darkerMode = loaderStyle === 'darker';
      }

      loadingC = <LoaderIndicator darker={darkerMode} />;
    }

    return (
      <button
        type="button"
        disabled={disabled}
        data-component="button"
        {...rest}
        data-type={type}
        data-role={btnRole}
        data-wide={wide}
        data-big={big}
        data-loading={loading}
        className={cx('Button', className, { uppercase, wide, big, loading })}
        onClick={this.handleClick}>
        {!disabled && <span className={cx('waves', getWavesClassName({ lighter: wavesLighter || (type === 'raised' && btnRole === 'primary') }))} />}
        {content}
        {loadingC}
      </button>
    );
  }
}
