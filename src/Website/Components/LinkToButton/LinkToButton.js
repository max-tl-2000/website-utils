/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

import React, { Component } from 'react';
import Button from '../../../components/Button/Button';
import { qs } from '../../../common/dom';

export default class LinkToButton extends Component {
  scrollToElement = () => {
    const { target } = this.props;
    if (!target) return;
    const ele = qs(target);
    if (!ele) throw new Error(`Cannot find element: ${target}`);

    ele.scrollIntoView(true);
  };

  render() {
    const { big, type, label = 'raised', id } = this.props;

    return <Button big={big} type={type} id={id} label={label} onClick={this.scrollToElement} />;
  }
}
