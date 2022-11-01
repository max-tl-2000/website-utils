/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

import React, { Component } from 'react';
import { storiesOf } from '@storybook/react';
import { Provider } from 'mobx-react';
import SearchMap from '../../src/Website/Containers/Map/SearchMap';
import PropertyMap from '../../src/Website/Containers/Map/PropertyMap';
import PropertyInfoBox from '../../src/Website/Containers/Map/PropertyInfoBox';
import { properties as sampleProperties, extendedProperties, propertyCardActions } from '../resources/fixtures';
import Block from '../helpers/Block';
import * as T from '../../src/components/Typography/Typopgraphy';
import Button from '../../src/components/Button/Button';
import { setGoogleMapsApiToken } from '../../src/common/initGoogleMapsApi';
import { GOOGLE_MAPS_API_TOKEN } from '../../config';

const searchStoreWithAllResults = {
  loaded: true,
  resultsCount: extendedProperties.length,
  searchResults: extendedProperties,
};

const searchStoreWithNoResults = {
  loaded: true,
  resultsCount: 0,
  searchResults: [],
};

const searchStoreWithPartialResults = {
  loaded: true,
  resultsCount: sampleProperties.slice(0, 3).length,
  searchResults: sampleProperties.slice(0, 3),
};

const searchStoreWithSingleResult = {
  loaded: true,
  resultsCount: 1,
  searchResults: [sampleProperties[0]],
};

const searchStoreWithSanFranciscoResults = {
  loaded: true,
  resultsCount: sampleProperties.length,
  searchResults: sampleProperties,
};

const getURLForProperty = () => '';
const { onPropertyClick } = propertyCardActions;

class SearchMapWrapper extends Component {
  constructor() {
    super();
    setGoogleMapsApiToken(GOOGLE_MAPS_API_TOKEN);
    this.state = {
      searchStore: searchStoreWithNoResults,
    };
  }

  searchPropertiesWithAllResults = () => this.setState({ searchStore: searchStoreWithAllResults });

  searchPropertiesWithNoResults = () => this.setState({ searchStore: searchStoreWithNoResults });

  searchPropertiesWithPartialResults = () => this.setState({ searchStore: searchStoreWithPartialResults });

  searchPropertiesWithSingleResults = () => this.setState({ searchStore: searchStoreWithSingleResult });

  searchPropertiesSanFranciscoResults = () => this.setState({ searchStore: searchStoreWithSanFranciscoResults });

  render() {
    const { searchStore } = this.state;
    const { title } = this.props;

    const buttonContainerStyle = { width: '1024px', display: 'flex', flexFlow: 'row wrap', padding: '10px 0' };
    const buttonStyle = { margin: '0 5px' };

    return (
      <Block>
        <T.Title>{title}</T.Title>
        <div style={buttonContainerStyle}>
          <Button style={buttonStyle} label={'No results'} onClick={this.searchPropertiesWithNoResults} />
          <Button style={buttonStyle} label={'Single result'} onClick={this.searchPropertiesWithSingleResults} />
          <Button style={buttonStyle} label={'Partial San Francisco results'} onClick={this.searchPropertiesWithPartialResults} />
          <Button style={buttonStyle} label={'All San Francisco results'} onClick={this.searchPropertiesSanFranciscoResults} />
          <Button style={buttonStyle} label={'All results'} onClick={this.searchPropertiesWithAllResults} />
        </div>
        <div style={{ width: '1024px', height: '768px' }}>
          <SearchMap webSiteStore={{ getURLForProperty }} actions={{ onPropertyClick }} searchStore={searchStore} usePropertyImageHelper={false} />
        </div>
      </Block>
    );
  }
}

const propertyStore = {
  loaded: true,
  property: sampleProperties[0],
};

const webSiteStore = {
  loaded: true,
  currentPropertyStore: propertyStore,
  getURLForProperty,
};

class PropertyMapWrapper extends Component {
  constructor() {
    super();
    setGoogleMapsApiToken(GOOGLE_MAPS_API_TOKEN);
  }

  render() {
    const { title } = this.props;

    return (
      <Block>
        <T.Title>{title}</T.Title>
        <div style={{ width: '1024px', height: '768px' }}>
          <Provider webSiteStore={webSiteStore} actions={{ onPropertyClick }}>
            <PropertyMap usePropertyImageHelper={false} />
          </Provider>
        </div>
      </Block>
    );
  }
}

class PropertyInfoBoxWrapper extends Component {
  render() {
    const { title } = this.props;

    return (
      <Block>
        <T.Title>{title}</T.Title>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#c7d0dd',
            width: '640px',
            height: '480px',
          }}>
          <PropertyInfoBox property={sampleProperties[0]} usePropertyImageHelper={false} onPropertyClick={onPropertyClick} />
        </div>
      </Block>
    );
  }
}

storiesOf('Map', module)
  .add('Search Map', () => <SearchMapWrapper title={'Search Map'} />)
  .add('Property Map', () => <PropertyMapWrapper title={'Property Map'} />)
  .add('Map InfoBox', () => <PropertyInfoBoxWrapper title={'Map InfoBox'} />);
