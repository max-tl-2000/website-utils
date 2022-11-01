/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import classNames from 'classnames/bind';
import Button from '../Button/Button';
import styles from './IconButton.scss';

const cx = classNames.bind(styles);

export default class IconButton extends Component {
  static propTypes = {
    disabled: PropTypes.bool,
    className: PropTypes.any,
    label: PropTypes.string,
    type: PropTypes.string,
    iconOnLeft: PropTypes.bool,
    big: PropTypes.bool,
  };

  renderIcon = shouldDisplayIcon => {
    const { icon: SvgIcon, type = 'raised', disabled, btnRole } = this.props;
    const iconClassNames = cx('icon');
    return shouldDisplayIcon && SvgIcon ? (
      <span className={cx('iconWrapper', { dark: type === 'flat', disabled, secondary: btnRole === 'secondary' })}>
        {<SvgIcon className={iconClassNames} />}
      </span>
    ) : null;
  };

  render() {
    const { icon: SvgIcon, disabled, label, type = 'raised', big, wide, iconOnLeft, btnRole, className, children, ...btnProps } = this.props;

    const cNames = cx('IconButton', className, {
      hasLabel: !!label,
      iconOnLeft,
      big,
      wide,
    });

    const leftIcon = this.renderIcon(iconOnLeft);
    const rightIcon = this.renderIcon(!iconOnLeft);

    const dataLabel = label ? `button-${label}` : undefined;
    const hasChildren = !!children;

    return (
      <Button className={cNames} btnRole={btnRole} type={type} disabled={disabled} data-component="icon-button" data-id={dataLabel} {...btnProps}>
        {!hasChildren && (
          <span className={cx('children-container')}>
            {leftIcon}
            {label && <span className={cx('label')}>{label}</span>}
            {rightIcon}
          </span>
        )}
        {children}
      </Button>
    );
  }
}
