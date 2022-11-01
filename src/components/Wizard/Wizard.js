/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

/* eslint-disable react/prefer-stateless-function */
/* eslint-disable react/no-multi-comp */

import React, { Component, Children } from 'react';
import classnames from 'classnames/bind';
import styles from './Wizard.scss';
import * as T from '../Typography/Typopgraphy';

const cx = classnames.bind(styles);

export class Step extends Component {
  render() {
    const { children, compact, className, title, subTitle, useCustomizedStyle, container = true } = this.props;
    const renderWrapper = !!title || !!subTitle;
    return (
      <div className={cx('Step', { compact, container: container && !renderWrapper }, className)}>
        {renderWrapper && (
          <div className={cx('header')} data-id="dateSelectorHeader">
            {title && (
              <T.Header className={cx('title', { serifFont: useCustomizedStyle })} data-id="dateSelectorTitle">
                {title}
              </T.Header>
            )}
            {subTitle && (
              <T.Text className={cx('subTitle')} secondary data-id="dateSelectorSubTitle">
                {subTitle}
              </T.Text>
            )}
          </div>
        )}
        {renderWrapper && (
          <div className={cx('wrapper', { container })} data-id="wrapperContainer">
            {children}
          </div>
        )}
        {!renderWrapper && children}
      </div>
    );
  }
}

export class Wizard extends Component {
  render() {
    const { children, index, className } = this.props;

    const content = Children.toArray(children).filter(child => !!child)[index];

    return <div className={cx('Wizard', className)}>{content}</div>;
  }
}
