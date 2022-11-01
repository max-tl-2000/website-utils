/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

'use strict';

import classnames from 'classnames/bind';
import { action, observable, toJS } from 'mobx';
import { inject, observer } from 'mobx-react';
import React, { Component } from 'react';
import { Splide, SplideSlide } from '@splidejs/react-splide';
import uuid from 'uuid/v4';
import styles from './CarouselSelector.scss';
import Button from '../../../../components/Button/Button';
import LoadingBlock from '../../../../components/LoadingBar/LoadingBlock';
import { SlideConfig } from '../chatAssets';

const cx = classnames.bind(styles);

@inject(({ webSiteStore, chatGardenStore }) => ({
  webSiteStore,
  chatGardenStore,
}))
@observer
export default class CarouselSelector extends Component {
  @observable
  carouselSelected = 0;

  @action
  updateCarouselIndex = value => {
    this.carouselSelected = value;
  };

  returnInventory(id) {
    const { inventory, mode } = this.props;
    if (mode && mode === 'standard') {
      return this.props.callback('selectedId');
    }

    const inventoryValue = toJS(inventory);
    const foundInventory = inventoryValue.filter(item => item.marketingLayoutId === id)[0];
    this.props.callback(foundInventory);
    return true;
  }

  isFloorPlan(image) {
    return image.metadata?.floorPlan;
  }

  render() {
    // TODO: TOFIX: Remove dependency on Splide.
    return (
      <div className={cx('inventoryUnits')}>
        {this.isLoading && <LoadingBlock opaque />}
        {!this.isLoading && (
          <Splide
            className={cx('cdSplider')}
            onMove={(splide, newIndex, oldIndex, destIndex) => {
              setTimeout(() => {
                this.updateCarouselIndex(destIndex);
              }, 100);
            }}
            onPaginationMounted={(splide, list, active) => {
              active.button.style.backgroundColor = '#00bfa5';
            }}
            onClick={(Slide, e) => {
              this.updateCarouselIndex(e.index);
            }}
            updateOnMove="true"
            options={{
              ...SlideConfig,
            }}>
            {this.props.inventory?.map(item => (
              <SplideSlide className={cx('cdSpliderControls')} key={uuid()}>
                <div style={{ backgroundImage: `url(${item.imageUrl})`, backgroundSize: 'cover', width: '100%', height: '265px' }} />
                <div className={cx('display')}>
                  {item.inventory[0] && <p className={cx('carousel-title')}>Starting at ${item.inventory[0]?.lowestMonthlyRent}</p>}
                  {!item.inventory[0] && <p className={cx('carousel-title')}>Pricing available upon request</p>}
                  <p className={cx('carousel-subtitle')}>
                    {item.displayName} ({item.numBedrooms[0]} bed, {item.numBathrooms[0]} bath, {item.surfaceArea.max} sq ft)
                  </p>
                </div>
              </SplideSlide>
            ))}

            {this.props.imageUrls?.map(item => (
              <SplideSlide className={cx('cdSpliderControls')} key={uuid()}>
                <div
                  className={this.isFloorPlan(item) ? cx('csSplidefloorPlan') : cx('cdSplideImage')}
                  style={{ backgroundImage: `url(${item.url})`, width: '100%', height: '265px' }}
                />
                <div className={cx('display')}>
                  <p>{item.metadata.label}</p>
                </div>
              </SplideSlide>
            ))}
          </Splide>
        )}

        {this.props.inventory && (
          <Button
            key="submitBtn"
            onClick={() => this.returnInventory(this.props.inventory[this.carouselSelected]?.marketingLayoutId)}
            type="raised"
            style={{ margin: '12px auto 0', maxWidth: '96%' }} // TODO temp for now
            btnRole="secondary"
            label={
              this.props.inventory[this.carouselSelected].inventory[0]
                ? `Show me homes starting at $${this.props.inventory[this.carouselSelected]?.inventory[0]?.lowestMonthlyRent}`
                : 'Show me homes'
            }
            wide
          />
        )}
      </div>
    );
  }
}
