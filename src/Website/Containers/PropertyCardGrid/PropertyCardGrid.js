/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

import React, { Component } from 'react';
import classNames from 'classnames/bind';
import { observer } from 'mobx-react';
import PropertyCard from '../PropertyCard/PropertyCard';
import styles from './PropertyCardGrid.scss';

const cx = classNames.bind(styles);

@observer
export default class PropertyCardGrid extends Component {
  render() {
    const {
      properties,
      lazy,
      onPropertyClick,
      on3DTourClick,
      onPropertyHover,
      cols = 1,
      gutter = 16,
      verticalGutter = 16,
      usePropertyImageHelper,
      showRank = true,
      alignment,
      searchStore,
    } = this.props;

    const marginBottom = verticalGutter;

    if (alignment) {
      if (!alignment.match(/left|center|right/)) throw new Error('aligment value not valid. It should be left, center or right');
    }

    const renderPropertyCards = (searchProperties = []) =>
      searchProperties.map((property, index) => {
        let style = { width: '100%', marginBottom };

        if (cols > 1) {
          const width = `calc(${100 / cols}% + ${gutter / cols}px - ${gutter}px)`;
          const marginRight = (index + 1) % cols === 0 ? 0 : gutter;
          style = { ...style, width, marginRight };
        }

        return (
          <PropertyCard
            key={property.propertyId}
            data-id="propertyCard"
            property={property}
            style={style}
            className={cx('card')}
            searchResultRank={showRank ? index + 1 : undefined}
            onPropertyClick={onPropertyClick}
            on3DTourClick={on3DTourClick}
            onPropertyHover={onPropertyHover}
            lazy={lazy}
            usePropertyImageHelper={usePropertyImageHelper}
            searchStore={searchStore}
          />
        );
      });

    return <div className={cx('PropertyCardGrid', alignment)}>{renderPropertyCards(properties)}</div>;
  }
}
