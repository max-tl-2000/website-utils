/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import ReactDOM from 'react-dom';
import classnames from 'classnames/bind';

import { document as doc } from '../../common/globals';
import styles from './Portal.scss';

const cx = classnames.bind(styles);

@inject(stores => {
  const { widgetClasses } = stores;

  return {
    portalClassName: widgetClasses?.portalClassName || 'portalMountPoint',
  };
})
@observer
export default class Portal extends Component {
  render() {
    return <noscript />;
  }

  componentDidMount() {
    let { container, portalClassName, overlayClassName } = this.props;

    const portal = (this._portal = doc.createElement('div'));
    portal.setAttribute('class', cx('mountPoint', portalClassName, overlayClassName));
    portal.setAttribute('data-mount-point', 'true');

    if (container === undefined) container = doc.body;

    container.appendChild(this.portal);
    this.renderModal(this.props, {});
  }

  get portal() {
    return this._portal;
  }

  componentDidUpdate(prevProps) {
    const { portal } = this;
    const { portalClassName, overlayClassName } = this.props;
    portal.setAttribute('class', cx('mountPoint', portalClassName, overlayClassName));

    this.renderModal(this.props, prevProps);
  }

  componentWillUnmount() {
    const { portal } = this;
    ReactDOM.unmountComponentAtNode(portal);
    portal.parentNode.removeChild(portal);
  }

  renderModal({ children }) {
    ReactDOM.unstable_renderSubtreeIntoContainer(this, <>{children}</>, this.portal);
  }
}
