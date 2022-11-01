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
import RelatedPropertyList from '../../src/Website/Containers/RelatedPropertyList/RelatedPropertyList';
import { properties, propertyCardActions } from '../resources/fixtures';

const sampleProperties = [properties[0], properties[1], properties[2]];

const propertyStore = {
  relatedProperties: {
    loaded: true,
    loadProperties: () => sampleProperties,
    properties: sampleProperties,
  },
};

const propertyStoreWithError = {
  relatedProperties: {
    error: true,
    loadProperties: () => [],
    properties: [],
  },
};

const webSiteStore = {
  currentPropertyStore: propertyStore,
};

const webSiteStoreWithError = {
  currentPropertyStore: propertyStoreWithError,
};

const { onPropertyClick, on3DTourClick } = propertyCardActions;

class Wrapper extends Component {
  render() {
    const { fetchError } = this.props;

    return (
      <Block>
        <div style={{ width: '1100px' }}>
          <T.Title>Related Properties List</T.Title>
          <RelatedPropertyList
            webSiteStore={!fetchError ? webSiteStore : webSiteStoreWithError}
            usePropertyImageHelper={false}
            onPropertyClick={onPropertyClick}
            on3DTourClick={on3DTourClick}
          />
        </div>
      </Block>
    );
  }
}

storiesOf('RelatedPropertyList', module)
  .add('Related properties', () => <Wrapper />)
  .add('With fetch error', () => <Wrapper fetchError={true} />);
