/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

import React, { Component } from 'react';
import { observer } from 'mobx-react';
import classNames from 'classnames/bind';
import { observable, action } from 'mobx';
import CopyToClipboard from 'react-copy-to-clipboard';
import debounce from 'debouncy';
import TextBox from '../../../components/TextBox/TextBox';
import IconButton from '../../../components/IconButton/IconButton';
import SizeAware from '../../../components/SizeAware/SizeAware';
import { defaultBreakpointsAsArray } from '../../../components/SizeAware/Breakpoints';
import { trans } from '../../../common/trans';
import styles from './ShareLink.scss';
import * as T from '../../../components/Typography/Typopgraphy';
import SvgCopy from '../../../resources/svgs/copy.svg';
import { window } from '../../../common/globals';
import Field from '../../../components/Field/Field';

const cx = classNames.bind(styles);
const THRESHOLD_TO_INFORM_COPY_DONE = 3000;

@observer
export default class ShareLink extends Component {
  @observable
  isUrlCopied;

  @observable.shallow
  breakpoints;

  @action
  handleLinkCopy = () => {
    this.isUrlCopied = true;
    this.debounceHideUrlCopied();
  };

  debounceHideUrlCopied = debounce(
    action(() => {
      this.isUrlCopied = false;
    }),
    THRESHOLD_TO_INFORM_COPY_DONE,
  );

  get url() {
    const { url } = this.props;
    return url || window.location.href;
  }

  @action
  handleBreakpointChange = ({ matches }) => {
    this.breakpoints = matches;
  };

  render() {
    const { url, breakpoints } = this;

    const lblCopy = trans('COPY', 'copy');

    return (
      <SizeAware className={cx('ShareLink', breakpoints)} breakpoints={defaultBreakpointsAsArray} onBreakpointChange={this.handleBreakpointChange}>
        <T.Title className={cx('title', 'serifFont')}>{trans('SHARE', 'Share')}</T.Title>
        <div className={cx('share-link-body')}>
          <Field columns={breakpoints?.small1 ? 9 : 12} inline={breakpoints?.small1}>
            <TextBox value={url} wide readOnly />
          </Field>
          <Field noMargin columns={breakpoints?.small1 ? 3 : 12} inline={breakpoints?.small1} last>
            <CopyToClipboard text={url} onCopy={this.handleLinkCopy}>
              <IconButton big icon={SvgCopy} label={lblCopy} wide />
            </CopyToClipboard>
          </Field>
          {this.isUrlCopied && (
            <T.Caption noMargin highlight className={cx('link-copied-text')}>
              {trans('LINK_COPIED', 'Link copied')}
            </T.Caption>
          )}
        </div>
      </SizeAware>
    );
  }
}
