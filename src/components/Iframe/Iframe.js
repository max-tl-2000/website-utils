/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

import React, { Component } from 'react';
import classNames from 'classnames/bind';
import styles from './Iframe.scss';

const cx = classNames.bind(styles);

export default class Iframe extends Component {
  constructor(props) {
    super(props);
    this.state = {
      iframeLoaded: false,
    };
  }

  handleLoad = () => this.setState({ iframeLoaded: true });

  render() {
    const { src, onMessage, dataId, className, title, fallbackImage, ...props } = this.props;
    const { iframeLoaded } = this.state;
    return (
      <>
        {fallbackImage && <div className={cx('fallback', { hide: iframeLoaded })} style={{ backgroundImage: `url(${fallbackImage})` }} />}
        <div className={cx('wrapper', { active: iframeLoaded })}>
          <iframe data-id={dataId} onLoad={this.handleLoad} className={cx('iframe', className)} src={src} title={title} {...props} />
        </div>
      </>
    );
  }
}
