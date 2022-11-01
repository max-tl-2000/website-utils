/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { computed, action, observable } from 'mobx';
import classNames from 'classnames/bind';
import { trans } from '../../../common/trans';
import Picture from '../../../components/Picture/Picture';
import Button from '../../../components/Button/Button';
import * as T from '../../../components/Typography/Typopgraphy';
import styles from './UnitTypeBlock.scss';
import { getUnitTypeImage } from '../../helpers/images';
import { asMoney } from '../../../common/format';
import { parseAsInTimezone } from '../../../common/moment-utils';
import { DATE_US_FORMAT } from '../../helpers/dateConstants';
import { formatSurfaceAreaRange, hasSurfaceArea, formatNumOfItems, hasItems, prefixEachKeyWithData } from '../../helpers/properties';
import SizeAware from '../../../components/SizeAware/SizeAware';
import ellipsis from '../../../common/ellipsis';
import { lineClampEnabled } from '../../../common/support';
import PhoneButton from '../../Components/PhoneButton/PhoneButton';
import { SubContexts, Events, Categories, Components } from '../../helpers/tracking-helper';

const cx = classNames.bind(styles);

@inject('webSiteStore')
@observer
export default class UnitTypeBlock extends Component {
  @observable
  currentWidth;

  @computed
  get layoutStore() {
    const { webSiteStore } = this.props;
    const { currentPropertyStore = {} } = webSiteStore;
    return currentPropertyStore.layoutStore;
  }

  @action
  handleOnSizeChange = ({ width }) => {
    if (this.currentWidth === width) return;
    this.currentWidth = width;
  };

  @action
  handleTourOpen = () => {
    const { onTourDialogOpen } = this.props;
    onTourDialogOpen && onTourDialogOpen();
  };

  handleOnInventorySelected = unit => {
    this.layoutStore?.setSelectedInventoryId(unit?.inventoryId);

    const { webSiteStore } = this.props;
    const property = webSiteStore?.currentPropertyStore?.property;

    const unitName = unit?.name;
    const unitInventoryId = unit?.inventoryId;

    webSiteStore.notifyEvent(Events.INVENTORY_CLICK, {
      category: Categories.SALES,
      component: Components.INVENTORY_UNIT,
      name: unitName,
      eventLabel: `${unitInventoryId}-${unitName}`,
      inventoryId: unitInventoryId,
      propertyId: property?.propertyId,
      propertyName: property?.name,
    });
  };

  getAvailability = ({ availabilityDate, isAvailableNow, availabilityDateIsEstimated }) => {
    if (isAvailableNow) return `${trans('AVAILABLE_NOW', 'Available now')}!`;
    if (availabilityDateIsEstimated) return `${trans('AVAILABLE_SOON', 'Available soon')}`;

    const { currentPropertyStore = {} } = this.props.webSiteStore;
    const date = parseAsInTimezone(availabilityDate, { timezone: currentPropertyStore.timezone }).format(DATE_US_FORMAT);
    return trans('AVAILABLE_ON_DATE', 'Available {{date}}', { date });
  };

  renderTitleSection = (unit, className) => {
    const { surfaceArea, numBedrooms, numBathrooms, sqft, beds, baths } = unit;

    return (
      <div className={cx('titleSection', className)} data-id="marketingLayoutTitleContainer">
        <T.Header className={cx('title')}>{unit.displayName}</T.Header>
        <div className={cx('distribution')} data-id="marketingLayoutUnitInfo">
          {hasSurfaceArea(surfaceArea) && (
            <div>
              <T.Title inline className={cx('label')}>
                {trans('AREA', 'Area')}:
              </T.Title>
              <T.Title data-id="marketingLayoutSqft" inline>
                {sqft}
              </T.Title>
            </div>
          )}
          <div className={cx('bedsBaths')}>
            {hasItems(numBedrooms) && (
              <div>
                <T.Title inline className={cx('label')}>
                  {trans('BEDS', 'Beds:')}
                </T.Title>
                <T.Title data-id="marketingLayoutNumBedrooms" inline>
                  {beds}
                </T.Title>
              </div>
            )}
            {hasItems(numBathrooms) && (
              <div>
                <T.Title inline className={cx('label')}>
                  {trans('BATHS', 'Baths:')}
                </T.Title>
                <T.Title data-id="marketingLayoutNumBathrooms" inline>
                  {baths}
                </T.Title>
              </div>
            )}
          </div>
        </div>
        {unit.description && <T.Text data-id="marketingLayoutUnitDescription">{unit.description}</T.Text>}
      </div>
    );
  };

  getMessageSize = () => {
    if (!this.currentWidth) return 40;
    return Math.floor(this.currentWidth / 5);
  };

  handleKeyDownOnInventory = (e, inventory) => {
    if (e.key === 'Enter') {
      this.handleOnInventorySelected(inventory);
    }
  };

  renderInventory = (inventory, itemNumber) => {
    const { enableHeroListingHighlight } = this.props;
    const selected = inventory.inventoryId === this.layoutStore?.selectedInventoryId;
    const hasAmenities = !!inventory.amenities?.length;
    const amenities = hasAmenities ? inventory.amenities.map(it => it.displayName).join(', ') : trans('NO_UNITS', 'No Units');
    const price = inventory.lowestMonthlyRent ? asMoney(inventory.lowestMonthlyRent, { minimumFractionDigits: 0 }) : '--';
    const availability = this.getAvailability(inventory);
    const unitDataProps = { 'unit-id': inventory.inventoryId, 'available-date': availability, price, amenities };
    const useHeroListingHighlight = enableHeroListingHighlight && itemNumber === 0;

    return (
      <SizeAware
        key={inventory.inventoryId}
        className={cx('card', { selected })}
        tabIndex={0}
        data-id="marketingLayoutUnitCard"
        data-unit-highlighted={useHeroListingHighlight}
        data-selected={selected}
        onKeyDown={e => this.handleKeyDownOnInventory(e, inventory)}
        onClick={() => this.handleOnInventorySelected(inventory)}
        onSizeChange={this.handleOnSizeChange}
        {...prefixEachKeyWithData(unitDataProps)}>
        <T.Text data-id="availableDate" lighterForeground={selected} className={cx('available')}>
          <span>{availability}</span>
        </T.Text>
        <div className={cx('startingAt')} data-id="apartmentPriceContainer">
          <T.Text>{trans('STARTTING_AT', 'Starting at')}</T.Text>
          <T.Text data-id="price">{price}</T.Text>
        </div>
        <div className={cx('apartment')} data-id="apartmentNumberContainer">
          <T.Caption secondary>{trans('APARTMENT', 'Apartment')}</T.Caption>
          <T.Caption secondary>{inventory.buildingQualifiedName}</T.Caption>
        </div>
        {hasAmenities && <div data-id="innerCardDivider" className={cx('innerCardDivider')} />}
        <T.Text data-id="amenitiesList" secondary clampLines={2} className={cx('details', { empty: !hasAmenities })} title={amenities}>
          {lineClampEnabled ? amenities : ellipsis(amenities, this.getMessageSize())}
        </T.Text>
      </SizeAware>
    );
  };

  renderEmptyState = (unit, className, enableScheduleTour) => (
    <div className={cx('emptyStateContainer', className)} data-id="emptyStateContainer">
      <T.Title>{trans('AVAILABILITY_MESSAGE', 'Our availability is limited right now, but things can change fast! Give us a call at:')}</T.Title>
      {this.props.webSiteStore?.currentPropertyStore?.phone && (
        <PhoneButton
          phone={this.props.webSiteStore?.currentPropertyStore?.phone}
          smsEnabled={this.props.webSiteStore?.currentPropertyStore?.property?.smsEnabled}
          subContext={SubContexts.INVENTORY_UNIT}
        />
      )}
      {/* will probaly return after COVID-19 */}
      {/* <T.Title style={{ marginTop: '10px' }}>{trans('AVAILABILITY_MESSAGE', 'Or stop by and tour the community.')}</T.Title> */}
      {enableScheduleTour && (
        <Button className={cx('scheduleTourBtn')} type="raised" big wide label={trans('SCHEDULE_A_TOUR', 'Schedule a Tour')} onClick={this.handleTourOpen} />
      )}
    </div>
  );

  render({ unit, className, matches, enableScheduleTour } = this.props) {
    const hasUnits = !!unit.inventory.length;
    const { surfaceArea = {}, numBedrooms = [], numBathrooms = [], description, marketingLayoutId, name } = unit;
    const sqft = formatSurfaceAreaRange(surfaceArea);
    const beds = formatNumOfItems(numBedrooms);
    const baths = formatNumOfItems(numBathrooms);
    const layoutDataProps = { card: name, 'marketing-layout-id': marketingLayoutId, sqft, beds, baths, description };
    return (
      <div data-id="marketingLayout" {...prefixEachKeyWithData(layoutDataProps)} tabIndex={0} className={cx('unitContainer', className, { ...matches })}>
        {this.renderTitleSection({ ...unit, ...layoutDataProps }, className)}
        <div className={cx('unitBlock', className)} data-id="marketingLayoutUnitBlock">
          <div className={cx('imageContainer', className)} data-id="marketingLayoutImageContainer">
            <Picture src={getUnitTypeImage(unit.imageUrl)} className={cx('image')} backgroundSize={'cover'} />
          </div>
          <div className={cx('unitCards', className, { emptyState: !hasUnits })} data-id="marketingLayoutCardsContainer">
            {hasUnits && unit.inventory.map((inventory, index) => this.renderInventory(inventory, index))}
            {!hasUnits && this.renderEmptyState(unit, className, enableScheduleTour)}
          </div>
        </div>
      </div>
    );
  }
}
