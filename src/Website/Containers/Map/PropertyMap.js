/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

import React, { Component } from 'react';
import classNames from 'classnames/bind';
import { observer, inject } from 'mobx-react';
import styles from './PropertyMap.scss';
import RevaMap from './RevaMap';
import { trans } from '../../../common/trans';
import * as T from '../../../components/Typography/Typopgraphy';

const cx = classNames.bind(styles);

const getProperties = propertyStore => (propertyStore && propertyStore.property ? [propertyStore.property] : []);

@inject(({ webSiteStore, actions }) => ({
  properties: getProperties(webSiteStore.currentPropertyStore),
  propertyStore: webSiteStore.currentPropertyStore || {},
  getURLForProperty: webSiteStore.getURLForProperty,
  onPropertyClick: actions.onPropertyClick,
}))
@observer
export default class PropertyMap extends Component {
  handlePropertyClick = item => {
    const { onPropertyClick, getURLForProperty } = this.props;
    const url = getURLForProperty(item);

    onPropertyClick && onPropertyClick({ ...item, url });
  };

  render() {
    const { usePropertyImageHelper, properties, propertyStore } = this.props;

    return (
      <div className={cx('PropertyMap')}>
        {propertyStore.error && <T.Text error>{trans('PROPERTY_FETCH_ERROR', 'An error occured fetching the property')}</T.Text>}
        <RevaMap properties={properties} usePropertyImageHelper={usePropertyImageHelper} isPropertyMap={true} onPropertyClick={this.handlePropertyClick} />
      </div>
    );
  }
}
