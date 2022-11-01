/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import classnames from 'classnames/bind';
import PhoneIcon from '../../../resources/svgs/PhoneIcon.svg';
import * as T from '../../../components/Typography/Typopgraphy';
import styles from './PhoneButton.scss';
import { trans } from '../../../common/trans';
import { parseAPhone } from '../../../common/phone/phone-helper';
import { Events, Categories, Components } from '../../helpers/tracking-helper';

const cx = classnames.bind(styles);

@observer
export class PhoneButtonComponent extends Component {
  handleClick = () => {
    const { subContext, phone, webSiteStore } = this.props;
    webSiteStore.notifyEvent(Events.PHONE_BUTTON_CLICK, { phone, category: Categories.USER_ACTION, component: Components.PHONE_BUTTON, subContext });
  };

  render() {
    const { phone, smsEnabled } = this.props;
    const thePhone = parseAPhone(phone);
    const labelMessage = smsEnabled ? trans('CALL_OR_TEXT', 'CALL or TEXT') : trans('CALL_US', 'CALL US');
    return (
      <div data-part="phoneButton" className={cx('PhoneButton')}>
        <span className={cx('svg')}>
          <PhoneIcon data-part="pb-phoneIcon" />
        </span>
        <T.Text data-part="pb-phoneText" inline className={cx('textContainer')}>
          <T.Text inline className={cx('callUs')}>
            {labelMessage}
          </T.Text>
          <T.Link data-id="phone" href={`tel:${thePhone.international}`} onClick={this.handleClick} className={cx('phone')} inline>
            {thePhone.format()}
          </T.Link>
        </T.Text>
      </div>
    );
  }
}

const PhoneButton = inject('webSiteStore')(PhoneButtonComponent);
export default PhoneButton;
