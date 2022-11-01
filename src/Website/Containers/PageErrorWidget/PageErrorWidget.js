/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import classNames from 'classnames/bind';
import Revealer from '../../../components/Revealer/Revealer';
import * as T from '../../../components/Typography/Typopgraphy';
import Button from '../../../components/Button/Button';
import { window } from '../../../common/globals';
import { trans } from '../../../common/trans';
import styles from './PageErrorWidget.scss';

const cx = classNames.bind(styles);

@inject('webSiteStore')
@observer
export default class PageErrorWidget extends Component {
  refresh = () => {
    window.location.reload();
  };

  render() {
    const { webSiteStore } = this.props;

    return (
      <Revealer className={cx('PageErrorWidget')} show={webSiteStore.storesFailed}>
        <T.Text className={cx('errorMessage')}>
          {trans('LOADING_ERROR', 'Looks like we ran into an issue loading this page. Try refreshing the page in a few seconds.')}
        </T.Text>
        <Button className={cx('reloadButton')} label={trans('REFRESH', 'Refresh')} onClick={this.refresh} />
      </Revealer>
    );
  }
}
