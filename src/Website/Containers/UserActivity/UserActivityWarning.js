/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import classNames from 'classnames/bind';
import styles from './UserActivityWarning.scss';
import * as T from '../../../components/Typography/Typopgraphy';
import Button from '../../../components/Button/Button';
import { trans } from '../../../common/trans';
import { window } from '../../../common/globals';
import { AppLinkIdUrls } from '../../../common/appConstants';

const cx = classNames.bind(styles);

@inject('webSiteStore')
@observer
export default class UserActivityWarning extends Component {
  handlerEnableTrackUserActivity = () => {
    const { webSiteStore, onEnableTrackUserActivity } = this.props;
    webSiteStore?.enableTrackUserActivity(true);
    onEnableTrackUserActivity && onEnableTrackUserActivity();
  };

  handlerPrivacyPolicy = () => {
    const url = AppLinkIdUrls.PRIVACY_POLICY_ID;
    const privaPolicyWindow = window.open(url, '_blank');
    privaPolicyWindow.opener = null;
    privaPolicyWindow.location = url;
  };

  render() {
    const { attestation, webSiteStore, className } = this.props;
    if (webSiteStore?.trackUserActivityEnabled) return <noscript />;

    return (
      <div className={cx('user-activity-container', className)}>
        <T.Caption noMargin className={cx('message')}>
          <T.Caption noMargin inline className={cx('text')}>
            {trans('PROTECT_YOUR_PRIVACY_WARNING', 'We strive to protect your privacy while providing a great experience. Learn more by reading our')}
          </T.Caption>
          <T.Link noMargin inline className={cx('privacy-policy', 'text')} onClick={this.handlerPrivacyPolicy}>
            {trans('PRIVACY_POLICY', 'Privacy Policy')}
          </T.Link>
          {attestation && <T.Caption noMargin inline className={cx('text')}>{`, ${trans('ACCECPT_IF_YOU_AGREE', 'and accept if you agree.')}`}</T.Caption>}
        </T.Caption>
        {attestation && (
          <div className={cx('attestation')}>
            <Button label={trans('ACCEPT', 'Accept')} data-id="acceptPrivacyPolicyButton" onClick={this.handlerEnableTrackUserActivity} />
          </div>
        )}
      </div>
    );
  }
}
