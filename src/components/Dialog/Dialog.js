/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

import React, { Component } from 'react';
import classnames from 'classnames/bind';
import styles from './Dialog.scss';
import * as T from '../Typography/Typopgraphy';
import LoadingBlock from '../LoadingBar/LoadingBlock';

const cx = classnames.bind(styles);

const Voices = {
  BOT: 'bot',
  USER: 'user',
};
export default class Dialog extends Component {
  static defaultProps = {
    voice: Voices.BOT,
    component: 'loader',
  };

  render() {
    const { voice, text } = this.props;

    return (
      <div className={cx('Dialog', voice, !text && 'noBg')}>
        {!text && (
          <div className={cx('botLoading')}>
            <LoadingBlock />
          </div>
        )}
        {text && <T.Text dangerouslySetInnerHTML={{ __html: text }} />}
      </div>
    );
  }
}
