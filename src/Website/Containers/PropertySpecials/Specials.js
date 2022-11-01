/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import classNames from 'classnames/bind';
import { observable, action } from 'mobx';
import SizeAware from '../../../components/SizeAware/SizeAware';
import { defaultBreakpointsAsArray } from '../../../components/SizeAware/Breakpoints';
import { trans } from '../../../common/trans';
import styles from './Specials.scss';
import * as T from '../../../components/Typography/Typopgraphy';

const cx = classNames.bind(styles);

@inject('webSiteStore')
@observer
export default class Specials extends Component {
  @observable.shallow
  breakpoints;

  @action
  handleBreakpointChange = ({ matches }) => {
    this.breakpoints = matches;
  };

  render() {
    const { webSiteStore } = this.props;
    const { breakpoints } = this;
    const { currentPropertyStore: propertyStore = {} } = webSiteStore;
    const { property = {} } = propertyStore;

    return (
      <>
        {property.specials && (
          <SizeAware className={cx('specials-container')} breakpoints={defaultBreakpointsAsArray} onBreakpointChange={this.handleBreakpointChange}>
            <div className={cx('wrapper', breakpoints)}>
              <T.Title className={cx('specials-text')}>
                <span>{trans('SPECIALS', 'Specials:')}</span> {property.specials}
              </T.Title>
            </div>
          </SizeAware>
        )}
      </>
    );
  }
}
