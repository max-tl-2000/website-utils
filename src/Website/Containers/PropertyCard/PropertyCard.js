/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

import React, { Component } from 'react';
import classNames from 'classnames/bind';
import { observer } from 'mobx-react';

import { reaction, observable, action } from 'mobx';
import * as T from '../../../components/Typography/Typopgraphy';
import styles from './PropertyCard.scss';
import { trans } from '../../../common/trans';
import { formatPhoneToDisplay } from '../../../common/phone/phone-helper';
import { asMoney, defaultCurrencyFormatterOpts } from '../../../common/format';
import Picture from '../../../components/Picture/Picture';
import { formatLayoutGroups } from '../../helpers/propertyCard';
import { formatSurfaceAreaRange, prefixEachKeyWithData } from '../../helpers/properties';
import { getPropertyCardImage } from '../../helpers/images';
import Bookmark from './resources/bookmark.svg';
import BookmarkOutline from './resources/bookmark-outline.svg';
import TourIcon from './resources/cube.svg';
import PhoneIcon from './resources/phone-in-talk.svg';
import ClampLines from '../../../components/ClampLines/ClampLines';

const cx = classNames.bind(styles);
const TOUR_TAG = '3DTour';

@observer
export default class PropertyCard extends Component {
  @observable
  highlighted = false;

  @observable
  selected = false;

  @action
  setHighlighted = highlighted => {
    this.highlighted = highlighted;
  };

  @action
  setSelectedProperty = selected => {
    this.selected = selected;
  };

  highlightPropertyCard = ({ propertyId, event }) => {
    const { property } = this.props;
    if (propertyId !== property.propertyId) return;

    if (event === 'mouseover') {
      this.setHighlighted(true);
      return;
    }

    this.setHighlighted(false);
  };

  toggleSelected = propertyId => {
    const { property } = this.props;

    if (propertyId !== property.propertyId) return false;

    return !this.selected;
  };

  handlePropertyClick = () => {
    const { property, onPropertyClick, searchResultRank } = this.props;
    this.setSelectedProperty(this.toggleSelected(property.propertyId));
    onPropertyClick && onPropertyClick(property, searchResultRank);
  };

  handlePropertySelected = ({ propertyId }) => {
    this.setSelectedProperty(this.toggleSelected(propertyId));
  };

  componentWillUnmount() {
    this.stopHighlightPropertyReaction && this.stopHighlightPropertyReaction();
    this.stopSelectedPropertyReaction && this.stopSelectedPropertyReaction();
  }

  componentDidMount() {
    const { searchStore } = this.props;
    if (searchStore) {
      this.stopHighlightPropertyReaction = reaction(() => searchStore.highlightedProperty, this.highlightPropertyCard);
      this.stopSelectedPropertyReaction = reaction(() => searchStore.selectedProperty, this.handlePropertySelected);
    }
  }

  render() {
    const { property, onPropertyHover, on3DTourClick, usePropertyImageHelper = true, searchResultRank, lazy, style, className } = this.props;

    const { surfaceArea = {}, marketRent = {}, marketingLayoutGroups = [] } = property;

    const moneyFormat = { ...defaultCurrencyFormatterOpts, minimumFractionDigits: 0 };

    const formattedLayoutGroups = formatLayoutGroups({ marketingLayoutGroups });
    const formattedSurfaceAreaRange = formatSurfaceAreaRange(surfaceArea);
    const formattedStartingAtAmount = `${trans('STARTING_AT', 'Starting')} ${asMoney(marketRent.min || 0, moneyFormat)}`;
    const formattedPhoneNumber = formatPhoneToDisplay(property.phone);

    const renderTestimonial = ({ testimonials = [] }) => {
      if (!testimonials.length) return <div />;

      return (
        <div className={cx('blurBackground')}>
          <div className={cx('testimonialMask')} />
          <div className={cx('testimonialContainer')}>
            <T.Text className={cx('testimonial')}>{testimonials[0]}</T.Text>
          </div>
        </div>
      );
    };

    const render3DTourLink = prop => {
      let { tags = [] } = prop;
      if (typeof tags === 'string') {
        tags = tags.split(',').map(p => p.trim());
      }
      if (tags.some(tag => tag === TOUR_TAG)) {
        return (
          <div className={cx('tourContainer')} onClick={e => on3DTourClick && on3DTourClick(prop, e)}>
            <T.Text secondary className={cx('tour')}>
              {trans('3D_TOUR', '3D TOUR')}
            </T.Text>
            <TourIcon className={cx('tourIcon')} />
          </div>
        );
      }

      return <div />;
    };

    const sqft = formattedSurfaceAreaRange;
    const fullAddress = property.formattedLongAddress;
    const formattedFullAddress = property.formattedFullAddress;
    const propertyDataProps = {
      'property-id': property.propertyId,
      layouts: formattedLayoutGroups,
      sqft,
      'min-price': formattedStartingAtAmount,
      address: fullAddress,
      phone: formattedPhoneNumber,
    };

    return (
      <div
        style={style}
        id={`property_${property.propertyId}`}
        className={cx('PropertyCard', className, { highlight: this.highlighted, selected: this.selected })}
        onClick={() => this.handlePropertyClick && this.handlePropertyClick()}
        onMouseOver={e => onPropertyHover && onPropertyHover(property, e)}
        onMouseOut={e => onPropertyHover && onPropertyHover(property, e)}
        onFocus={() => this.handleFocus && this.handleFocus()}
        onBlur={() => this.handleFocus && this.handleFocus()}
        {...prefixEachKeyWithData(propertyDataProps)}>
        <div className={cx('propertyImageContainer')}>
          <Picture
            src={(usePropertyImageHelper && getPropertyCardImage(property.imageUrl)) || property.imageUrl}
            className={cx('propertyImage')}
            backgroundSize={'cover'}
            lazy={lazy}
            imgStyle={{ backgroundPosition: 'left bottom' }}
            caption={() => renderTestimonial(property)}
          />
          {render3DTourLink(property)}
        </div>

        <ClampLines data-part="pc-name" text={property.displayName} lines={2} ellipsis="..." buttons={false} className={cx('propertyName', 'serifFont')} />

        <div data-id="propertyCard" className={cx('propertyInfo')}>
          <div data-part="pc-description-group" className={cx('propertyDescription')}>
            <T.Text data-part="pc-layouts" className={cx('descriptionItem', { empty: !marketingLayoutGroups.length })} title={formattedLayoutGroups}>
              {marketingLayoutGroups.length ? formattedLayoutGroups : 'NO_PROPERTY_LAYOUTS'}
            </T.Text>
            <T.Text data-part="pc-surface" className={cx('descriptionItem', { empty: !surfaceArea.min && !surfaceArea.max })} title={formattedSurfaceAreaRange}>
              {surfaceArea.min || surfaceArea.max ? formattedSurfaceAreaRange : 'NO_PROPERTY_SURFACE_AREA'}
            </T.Text>
            <T.Text data-pc="pc-market-rent" className={cx('descriptionItem', 'bold', { empty: !marketRent.min })} title={formattedStartingAtAmount}>
              {marketRent.min ? formattedStartingAtAmount : 'NO_MARKET_RENT'}
            </T.Text>
          </div>

          <div data-part="pc-contact-info" className={cx('propertyContactInfo')}>
            <div data-part="pc-phone-line" className={cx('phoneContainer')}>
              <T.Text data-part="pc-phone" className={cx('descriptionItem', 'bold', { empty: !property.phone })} title={formattedPhoneNumber}>
                {property.phone ? formattedPhoneNumber : 'NO_PHONE'}
              </T.Text>
              {property.phone && (
                <div data-part="pc-phone-ico" className={cx('phoneIconContainer')}>
                  <PhoneIcon className={cx('phoneIcon')} />
                </div>
              )}
            </div>
            <T.Text
              data-part="pc-address-line1"
              secondary
              className={cx('descriptionItem', { empty: !formattedFullAddress.fullAddressLine1 })}
              title={formattedFullAddress.fullAddressLine1}>
              {formattedFullAddress.fullAddressLine1 ? formattedFullAddress.fullAddressLine1 : 'NO_ADDRESS_LINE1'}
            </T.Text>
            {formattedFullAddress.fullAddressLine2 && (
              <T.Text
                data-part="pc-address-line2"
                secondary
                className={cx('descriptionItem', { empty: !formattedFullAddress.fullAddressLine2 })}
                title={formattedFullAddress.fullAddressLine2}>
                {formattedFullAddress.fullAddressLine2 ? formattedFullAddress.fullAddressLine2 : 'NO_ADDRESS_LINE2'}
              </T.Text>
            )}
            <T.Text
              data-part="pc-address-line3"
              secondary
              className={cx('descriptionItem', { empty: !formattedFullAddress.fullAddressLine3 })}
              title={formattedFullAddress.fullAddressLine3}>
              {formattedFullAddress.fullAddressLine3 ? formattedFullAddress.fullAddressLine3 : 'NO_CITY_STATE'}
            </T.Text>
          </div>
        </div>
        {property.geoLocation && searchResultRank && (
          <>
            {this.highlighted ? (
              <BookmarkOutline data-part="pc-bookmark" data-highlighted="true" className={cx('propertyBookmarkImage')} />
            ) : (
              <Bookmark data-part="pc-bookmark" className={cx('propertyBookmarkImage')} />
            )}
            <span
              data-part="pc-bookmark-label"
              data-highlighted={this.highlighted}
              className={cx('propertyBookmarkLabel', searchResultRank > 9 ? 'offset' : 'centered', this.highlighted ? 'highlight' : '')}>
              {searchResultRank}
            </span>
          </>
        )}
      </div>
    );
  }
}
