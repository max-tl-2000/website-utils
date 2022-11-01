/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

'use strict';

import classnames from 'classnames/bind';
import { action, computed, observable, toJS } from 'mobx';
import { inject, observer } from 'mobx-react';
import React, { Component } from 'react';
import { Splide, SplideSlide } from '@splidejs/react-splide';
import styles from './CarouselSelector.scss';
import { InventoryCard } from '../../../../components/InventoryCard/InventoryCard';
import LoadingBlock from '../../../../components/LoadingBar/LoadingBlock';
import '@splidejs/splide/dist/css/themes/splide-default.min.css';
import { SlideConfig } from '../chatAssets';

const cx = classnames.bind(styles);

@inject(({ webSiteStore, chatGardenStore }) => ({
  webSiteStore,
  chatGardenStore,
}))
@observer
export default class AvailableUnits extends Component {
  @observable
  inventoryLayouts = [];

  @observable
  isLoading = false;

  @observable
  activeCarouselIndex = 0;

  @computed
  get propertyStoreDetails() {
    const { webSiteStore } = this.props;
    const { currentPropertyStore = {} } = webSiteStore;
    return currentPropertyStore;
  }

  @action
  updateInventoryLayouts = value => {
    this.inventoryLayouts = value;
  };

  @action
  updateIsLoading = value => {
    this.isLoading = value;
  };

  @action
  updateCarouselIndex = value => {
    this.activeCarouselIndex = value;
  };

  async componentDidMount() {
    const units = toJS(this.props.units);
    this.updateInventoryLayouts(units);
  }

  render() {
    return (
      <div className={cx('inventoryUnits')}>
        {this.isLoading && <LoadingBlock opaque />}
        {!this.isLoading && (
          // TODO: TOFIX: Remove dependency on Splide.
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

              // Navigate to the selected index
              Slide.Components.Controller.go(e.index);

              // const inventorySelected = toJS(this.inventoryLayouts[e.index]);
              this.props.selectedInventory(this.inventoryLayouts[e.index]);
              // this.activeCarouselIndex === e.index;
            }}
            updateOnMove="true"
            options={{
              height: '300px',
              padding: {
                right: '6.7rem',
                left: '6.7rem',
              },
              ...SlideConfig,
            }}>
            {!!this.inventoryLayouts.length &&
              this.inventoryLayouts.map((card, index) => (
                <SplideSlide key={`slider-${card.inventoryId}`} className={cx('cdSpliderControls')}>
                  <InventoryCard isActive={this.activeCarouselIndex === index} inventoryInfo={card} />
                </SplideSlide>
              ))}
          </Splide>
        )}
      </div>
    );
  }
}
