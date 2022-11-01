/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

import React, { Component } from 'react';
import classNames from 'classnames/bind';
import { observer } from 'mobx-react';
import styles from './PropertyInfoBox.scss';
import * as T from '../../../components/Typography/Typopgraphy';
import Picture from '../../../components/Picture/Picture';
import { getPropertyCardImage } from '../../helpers/images';
import { asMoney, defaultCurrencyFormatterOpts } from '../../../common/format';
import { formatSurfaceAreaRange } from '../../helpers/properties';
import { formatLayoutGroups } from '../../helpers/propertyCard';
import { trans } from '../../../common/trans';

const cx = classNames.bind(styles);

@observer
export default class PropertyInfoBox extends Component {
  render() {
    const { property, usePropertyImageHelper = true, style, onPropertyClick } = this.props;
    const { surfaceArea = {} } = property;
    const moneyFormat = { ...defaultCurrencyFormatterOpts, minimumFractionDigits: 0 };
    const propertyDetailsSeparator = ' / ';
    const layouAndSurfaceAreaInfo = [formatLayoutGroups(property), formatSurfaceAreaRange(surfaceArea)].filter(data => data);
    const hasLayoutOrSurfaceAreaInfo = !!layouAndSurfaceAreaInfo.length;
    const hasMinMarketRent = !!property?.marketRent?.min;

    return (
      <div
        id={`property_infobox_${property.propertyId}`}
        className={cx('PropertyInfoBox')}
        style={style}
        onClick={() => onPropertyClick && onPropertyClick(property)}>
        <div className={cx('propertyInfoBoxBody')}>
          <div className={cx('propertyImageContainer')}>
            <Picture
              src={(usePropertyImageHelper && getPropertyCardImage(property.imageUrl, { width: 320, height: 165 })) || property.imageUrl}
              className={cx('propertyImage')}
              backgroundSize={'cover'}
              imgStyle={{ backgroundPosition: 'left bottom' }}
            />
          </div>

          <T.Header className={cx('propertyName', 'serifFont')} title={property.displayName}>
            {property.displayName}
          </T.Header>

          <T.Text className={cx('propertyInfo')}> {property.formattedShortAddress && `${property.formattedShortAddress}`} </T.Text>
          <T.Text className={cx('propertyInfo')}>
            {layouAndSurfaceAreaInfo.join(propertyDetailsSeparator)}
            {hasLayoutOrSurfaceAreaInfo && hasMinMarketRent && propertyDetailsSeparator}
            {hasMinMarketRent && (
              <span className={cx('bold')}>
                {trans('STARTING_AT', 'Starting')} {asMoney(property.marketRent.min, moneyFormat)}
              </span>
            )}
          </T.Text>
        </div>
        <div className={cx('propertyInfoBoxAnchor')} />
      </div>
    );
  }
}
