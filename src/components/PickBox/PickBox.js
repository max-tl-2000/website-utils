/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

import React, { Component } from 'react';
import { observer } from 'mobx-react';
import classnames from 'classnames/bind';
import styles from './PickBox.scss';
import * as T from '../Typography/Typopgraphy';
import CheckboxBlank from './checkbox-blank-outline.svg';
import CheckboxMarked from './checkbox-marked.svg';
import RadioboxBlank from './radiobox-blank.svg';
import RadioboxMarked from './radiobox-marked.svg';

const cx = classnames.bind(styles);
export const PickType = {
  CHECKBOX: 'checkbox',
  RADIO: 'radio',
};

@observer
export default class PickBox extends Component {
  getMarkedIcon = pickType => (pickType === PickType.RADIO ? <RadioboxMarked /> : <CheckboxMarked />);

  getUnmarkedIcon = pickType => (pickType === PickType.RADIO ? <RadioboxBlank /> : <CheckboxBlank />);

  render() {
    const { id, label, className, value, style, onClick, checked, pickType = PickType.CHECKBOX, white = false, labelClassName, big, tabIndex } = this.props;

    const handleKeyPress = e => {
      if (e.key === 'Enter') {
        onClick && onClick(e);
      }
    };

    return (
      <div
        id={id}
        tabIndex={tabIndex}
        data-component="pickbox"
        data-pick-type={pickType}
        data-checked={checked}
        data-value={value}
        data-label={label}
        className={cx('container', { big }, className)}
        style={style}
        onKeyPress={handleKeyPress}
        onClick={onClick}>
        {label && (
          <T.Caption className={cx('label', labelClassName, { white })} inline secondary={!checked}>
            {label}
          </T.Caption>
        )}
        <div className={cx('board', { white, radio: pickType === PickType.RADIO })} />
        <span className={cx('checkmark', { checked, white })}>{checked ? this.getMarkedIcon(pickType) : this.getUnmarkedIcon(pickType)}</span>
      </div>
    );
  }
}
