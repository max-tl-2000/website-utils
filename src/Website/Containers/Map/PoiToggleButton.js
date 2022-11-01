/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

import React, { Component } from 'react';
import classNames from 'classnames/bind';
import { observable, action } from 'mobx';
import { observer } from 'mobx-react';
import styles from './PoiToggleButton.scss';
import { trans } from '../../../common/trans';

const cx = classNames.bind(styles);

@observer
export default class PoiToggleButton extends Component {
  showLabel = trans('SHOW_PLACES_OF_INTEREST', 'Show places of interest');

  hideLabel = trans('HIDE_PLACES_OF_INTEREST', 'Hide places of interest');

  @observable
  label = this.showLabel;

  show = true;

  @action
  toggleLabel = () => {
    const { showLabel, hideLabel } = this;

    this.show = !this.show;

    if (this.show) {
      this.label = showLabel;
      return;
    }

    this.label = hideLabel;
  };

  handleOnClick = () => {
    const { props, toggleLabel } = this;
    const { onClick } = props;

    if (onClick) {
      toggleLabel();
      onClick();
    }
  };

  render() {
    const { label, handleOnClick } = this;

    return (
      <button type="button" className={cx('poiToggleBtn')} onClick={handleOnClick}>
        {label}
      </button>
    );
  }
}
