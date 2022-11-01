/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

import React, { Component } from 'react';
import classnames from 'classnames/bind';
import styles from './Avatar.scss';

const cx = classnames.bind(styles);

export default class Avatar extends Component {
  static defaultProps = {
    imgSrc: 'https://eitrawmaterials.eu/wp-content/uploads/2016/09/person-icon.png',
    title: 'Avatar',
    width: 56,
    height: 56,
  };

  render() {
    const { width, height, imgSrc, title } = this.props;

    return (
      <div className={cx('Avatar')} style={{ width, height }}>
        <img alt={title} src={imgSrc} title={title} />
      </div>
    );
  }
}
