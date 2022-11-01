/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

import React, { Component } from 'react';
import classnames from 'classnames/bind';
import MainSection from './MainSection';
import styles from './List.scss';

const cx = classnames.bind(styles);

// rowStyle [row-simple, row-mixed]
export default class ListItem extends Component {
  componentDidUpdate() {
    if (this.props.scrollWhenFocused && this.props.focused) {
      this.listItem.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
    }
  }

  render() {
    const {
      className,
      focused,
      clickable = true,
      hoverable = true,
      selected,
      disabled,
      onClick,
      wrapChildren,
      rowStyle = 'simple',
      children,
      scrollWhenFocused = false,
      ...rest
    } = this.props;
    const cNames = cx(
      'list-item',
      {
        hoverable,
        disabled,
        focused,
        clickable,
        selected,
      },
      rowStyle,
      className,
    );

    const content = wrapChildren && !scrollWhenFocused ? <MainSection>{children}</MainSection> : children;

    const fireClick = e => !disabled && (onClick && onClick(e));

    const handleKeyPress = e => {
      if (!disabled && e.key === 'Enter') {
        fireClick(e);
      }
    };

    return (
      <div
        ref={node => {
          this.listItem = node;
        }}
        data-component="list-item"
        onKeyPress={handleKeyPress}
        onClick={fireClick}
        className={cNames}
        {...rest}>
        {content}
      </div>
    );
  }
}
