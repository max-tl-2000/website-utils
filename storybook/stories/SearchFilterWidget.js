/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

import React, { Component } from 'react';
import { storiesOf } from '@storybook/react';
import Block from '../helpers/Block';
import * as T from '../../src/components/Typography/Typopgraphy';
import SearchFilters from '../../src/Website/Containers/SearchFilters/SearchFilters';

const webSiteStore = {
  loaded: true,
  lifestyles: [
    {
      displayName: '24 hour gym',
      infographicName: 'gym',
      order: 0,
    },
    {
      displayName: 'Active night life',
      infographicName: 'night-life',
      order: 0,
    },
    {
      displayName: 'Bike friendly',
      infographicName: 'bike-friendly',
      order: 0,
    },
    {
      displayName: 'Close to city center',
      infographicName: 'city-center',
      order: 0,
    },
    {
      displayName: 'Close to parks',
      infographicName: 'parks',
      order: 0,
    },
    {
      displayName: 'Close to public transit',
      infographicName: 'public-transit',
      order: 0,
    },
    {
      displayName: 'Club house',
      infographicName: 'club-house',
      order: 0,
    },
    {
      displayName: 'Family friendly',
      infographicName: 'family-friendly',
      order: 0,
    },
    {
      displayName: 'Good school district',
      infographicName: 'great-schools',
      order: 0,
    },
    {
      displayName: 'Pet friendly',
      infographicName: 'pet-friendly',
      order: 0,
    },
    {
      displayName: 'Rent controlled',
      infographicName: 'rent-controlled',
      order: 0,
    },
    {
      displayName: 'Water-front views',
      infographicName: 'water-front',
      order: 0,
    },
  ],
  marketingLayoutGroups: [
    {
      marketingLayoutGroupId: 'xxxxxxx',
      name: 'studio',
      displayName: 'Studio',
      description: null,
      shortDisplayName: 'Studio',
      order: 1,
    },
    {
      marketingLayoutGroupId: 'yyyyyyy',
      name: '2beds',
      displayName: '2 bedrooms',
      description: null,
      shortDisplayName: '2 beds',
      order: 3,
    },
  ],
};

const searchStore = {
  filtersLoaded: true,
  searchFilters: {},
  updateFilter: (key, value) => {
    searchStore.searchFilters[key] = value;
    console.log('Filter updated', searchStore.searchFilters);
  },
  performSearch: () => {},
  ...webSiteStore,
};

class Wrapper extends Component {
  render = ({ verticalLayout = false } = this.props) => (
    <Block>
      <div style={{ width: verticalLayout ? '600px' : '100%' }}>
        <T.Header style={{ marginBottom: '3rem' }}>Search Filters</T.Header>
        <SearchFilters searchStore={this.props.searchStore} />
      </div>
    </Block>
  );
}

storiesOf('WidgetSearchFilters', module)
  .add('Search filters', () => <Wrapper searchStore={{ ...searchStore }} />)
  .add('Search filters without floorplan type', () => <Wrapper searchStore={{ ...searchStore, marketingLayoutGroups: [] }} />)
  .add('Search filters Vertical layout', () => <Wrapper searchStore={{ ...searchStore }} verticalLayout />);
