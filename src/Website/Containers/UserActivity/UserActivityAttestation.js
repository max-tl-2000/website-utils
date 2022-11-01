/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import classNames from 'classnames/bind';
import { document as doc } from '../../../common/globals';
import UserActivityWarning from './UserActivityWarning';
import styles from './UserActivityWarning.scss';

const cx = classNames.bind(styles);

let _container;

export const createUserActivityContainer = () => {
  if (_container) return _container;

  const container = doc.createElement('div');
  doc.body.appendChild(container);
  return container;
};

@inject('webSiteStore')
@observer
export default class UserActivityAttestation extends Component {
  get trackUserActivityEnabled() {
    const { webSiteStore } = this.props;
    return webSiteStore?.trackUserActivityEnabled;
  }

  render() {
    if (this.trackUserActivityEnabled) return <noscript />;

    return (
      <div className={cx('attestation-Container')}>
        <UserActivityWarning attestation />
      </div>
    );
  }
}
