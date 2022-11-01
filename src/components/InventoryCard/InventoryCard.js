/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

// The Inventory Card borrows from the UnitTypeBlock to render out a single property card view
// This can be utilized by the UnitTypeBlock component as required however
// its design is based on the ChatGarden requirements

/* eslint-disable react/prefer-stateless-function */
/* eslint-disable react/no-multi-comp */

import moment from 'moment';
import React, { Component } from 'react';
import classnames from 'classnames/bind';
import { observer, inject } from 'mobx-react';
import { action, observable } from 'mobx';
import styles from './InventoryCard.scss';
import { prefixEachKeyWithData } from '../../Website/helpers/properties';
import { trans } from '../../common/trans';
import * as T from '../Typography/Typopgraphy';
import SizeAware from '../SizeAware/SizeAware';
import { DATE_US_FORMAT } from '../../Website/helpers/dateConstants';

const cx = classnames.bind(styles);

@inject('webSiteStore')
@observer
export class InventoryCard extends Component {
  @observable
  currentWidth;

  @observable
  isSelected = false;

  @action
  toggleIsSelected = value => {
    this.isSelected = this.props.inventoryInfo.inventoryId === value;
  };

  handleOnInventorySelected = id => {
    this.toggleIsSelected(id);
  };

  render() {
    const { isActive, inventoryInfo } = this.props;
    const activeCard = isActive;
    const selected = this.isSelected;
    const price = inventoryInfo?.marketRent;
    const amenities = inventoryInfo?.amenities.map((amenity, index) => `${index > 0 && ', '}${amenity.displayName}`);
    const availability = inventoryInfo?.availabilityDate ? `Available ${moment(inventoryInfo?.availabilityDate).format(DATE_US_FORMAT)}` : 'Unknown';
    const unitDataProps = { 'unit-id': inventoryInfo.inventoryId, 'available-date': availability, price, amenities };
    const foundAmenities = inventoryInfo?.amenities ? inventoryInfo?.amenities.map(am => am.displayName) : [];

    return (
      <SizeAware
        key={inventoryInfo.inventoryId}
        className={cx('inventoryCard', { selected }, { activeCard })}
        tabIndex={0}
        data-id="marketingLayoutUnitCard"
        // data-unit-highlighted={useHeroListingHighlight}
        data-selected={selected}
        // onKeyDown={e => this.handleKeyDownOnInventory(e, inventory)}
        onClick={() => this.handleOnInventorySelected(inventoryInfo.inventoryId)}
        onSizeChange={this.handleOnSizeChange}
        {...prefixEachKeyWithData(unitDataProps)}>
        <T.Text data-id="availableDate" lighterForeground={selected} className={cx('available')}>
          <span>{availability}</span>
        </T.Text>
        <div className={cx('startingAt')} data-id="apartmentPriceContainer">
          <T.Text data-id="price">
            {trans('STARTING_AT', 'Starting at')} ${inventoryInfo.lowestMonthlyRent}
          </T.Text>
        </div>
        <div className={cx('apartment')} data-id="apartmentNumberContainer">
          <T.Caption secondary>
            {trans('APARTMENT', 'Apartment')} {inventoryInfo.buildingQualifiedName}
          </T.Caption>
        </div>
        <T.Text data-id="amenitiesList" secondary clampLines={4} className={cx('details', { empty: !foundAmenities })}>
          {foundAmenities.join(', ')}
        </T.Text>
      </SizeAware>
    );
  }
}
