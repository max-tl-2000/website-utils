/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

import React, { Component } from 'react';
import { storiesOf } from '@storybook/react';
import PropertyCard from '../../src/Website/Containers/PropertyCard/PropertyCard';
import { properties, singleLayoutProperty, propertyCardActions } from '../resources/fixtures';
import Block from '../helpers/Block';
import * as T from '../../src/components/Typography/Typopgraphy';

const defaultProperty = { ...properties[0], displayName: 'Commons and Landing at Southgate' };

const noTestimonialProperty = {
  ...defaultProperty,
  testimonials: [],
};

const no3DTourProperty = {
  ...defaultProperty,
  tags: ['video'],
};

const singleMarketingLayoutProperty = {
  ...defaultProperty,
  ...singleLayoutProperty,
};

const shorterNameProperty = {
  ...defaultProperty,
  displayName: 'Park Place Apartments',
};

const propertyWithNoGeoLocation = {
  ...defaultProperty,
  geoLocation: null,
};

const { onPropertyClick, on3DTourClick } = propertyCardActions;

class Wrapper extends Component {
  render() {
    const { property, title } = this.props;

    return (
      <Block>
        <T.Title>Property Card - {title}</T.Title>
        <PropertyCard property={property} searchResultRank={1} onPropertyClick={onPropertyClick} on3DTourClick={on3DTourClick} usePropertyImageHelper={false} />
      </Block>
    );
  }
}

storiesOf('PropertyCard', module)
  .add('All options', () => <Wrapper property={defaultProperty} title={'All Options'} />)
  .add('No testimonial', () => <Wrapper property={noTestimonialProperty} title={'No testimonial'} />)
  .add('No 3D Tour', () => <Wrapper property={no3DTourProperty} title={'No 3D Tour'} />)
  .add('Single marketing layout', () => <Wrapper property={singleMarketingLayoutProperty} title={'Single marketing layout'} />)
  .add('Property with short name', () => <Wrapper property={shorterNameProperty} title={'Property with short name'} />)
  .add('Property with no geo location', () => <Wrapper property={propertyWithNoGeoLocation} title={'Property with no geo location'} />);
