/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

import React, { Component } from 'react';
import classNames from 'classnames/bind';
import styles from './PoiMarker.scss';
import ShoppingIcon from './resources/loc-shopping.svg';
import SchoolIcon from './resources/loc-school.svg';
import RestaurantIcon from './resources/loc-restaurant.svg';
import HospitalIcon from './resources/loc-hospital.svg';
import CinemaIcon from './resources/loc-cinema.svg';
import BankIcon from './resources/loc-bank.svg';
import TransitIcon from './resources/loc-transit.svg';
import PoiMarkerIcon from './resources/map-marker-small.svg';

const cx = classNames.bind(styles);

export default class PoiMarker extends Component {
  get poiMarkerIcon() {
    if (this.poiMarker) return this.poiMarker;

    const { category = '' } = this.props;
    switch (true) {
      case /^school$/.test(category):
        this.poiMarker = { icon: SchoolIcon, poiIconClass: 'school' };
        break;
      case /^bank$/.test(category):
        this.poiMarker = { icon: BankIcon, poiIconClass: 'bank' };
        break;
      case /^shopping_mall$|^department_store$/.test(category):
        this.poiMarker = { icon: ShoppingIcon, poiIconClass: 'shopping' };
        break;
      case /^hospital$/.test(category):
        this.poiMarker = { icon: HospitalIcon, poiIconClass: 'hospital' };
        break;
      case /^movie_theater$/.test(category):
        this.poiMarker = { icon: CinemaIcon, poiIconClass: 'cinema' };
        break;
      case /^restaurant$/.test(category):
        this.poiMarker = { icon: RestaurantIcon, poiIconClass: 'restaurant' };
        break;
      case /^bus_station$|^subway_station$|^airport$/.test(category):
        this.poiMarker = { icon: TransitIcon, poiIconClass: 'transit' };
        break;
      default:
        this.poiMarker = { poiIconClass: 'noCategoryMatch' };
        break;
    }

    return this.poiMarker;
  }

  render() {
    const { icon: PoiCategoryIcon, poiIconClass } = this.poiMarkerIcon;
    const { name = '' } = this.props;

    return (
      <div className={cx('poiMarkerContainer')} title={name}>
        <PoiMarkerIcon className={cx('poiMarkerIcon', poiIconClass)} />
        {PoiCategoryIcon && <PoiCategoryIcon className={cx('poiMarkerCategoryIcon')} />}
      </div>
    );
  }
}
