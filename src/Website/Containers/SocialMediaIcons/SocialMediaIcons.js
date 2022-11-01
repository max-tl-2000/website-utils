/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

import React, { Component } from 'react';
import { computed } from 'mobx';
import { observer } from 'mobx-react';
import classNames from 'classnames/bind';
import { SvgIcon } from '../../../components/SvgIcon/SvgIcon';
import styles from './SocialMediaIcons.scss';
import IconButton from '../../../components/IconButton/IconButton';

const cx = classNames.bind(styles);

@observer
export default class SocialMediaIcons extends Component {
  @computed
  get propertyStore() {
    const { webSiteStore } = this.props;
    const { currentPropertyStore = {} } = webSiteStore;
    return currentPropertyStore;
  }

  handleIconClicked = url => {
    window.open(url, '_blank');
  };

  render() {
    const { className, id } = this.props;
    const { property } = this.propertyStore;
    const { facebookURL, instagramURL, googleReviewsURL } = property || {};

    if (!facebookURL && !instagramURL && !googleReviewsURL) return <noscript />;

    return (
      <div data-component="social-icons" id={id} className={cx('socialIcons', className)}>
        {facebookURL && (
          <IconButton type="flat" onClick={() => this.handleIconClicked(facebookURL)}>
            <span className={cx('wrapper')}>
              <SvgIcon name="social:facebook" />
            </span>
          </IconButton>
        )}
        {instagramURL && (
          <IconButton type="flat" onClick={() => this.handleIconClicked(instagramURL)}>
            <span className={cx('wrapper')}>
              <SvgIcon name="social:instagram" />
            </span>
          </IconButton>
        )}
        {googleReviewsURL && (
          <IconButton type="flat" onClick={() => this.handleIconClicked(googleReviewsURL)}>
            <span className={cx('wrapper')}>
              <SvgIcon name="social:google" />
            </span>
          </IconButton>
        )}
      </div>
    );
  }
}
