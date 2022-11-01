/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

import React, { Component } from 'react';
import { Provider } from 'mobx-react';
import { storiesOf } from '@storybook/react';
import Block from '../helpers/Block';
import * as T from '../../src/components/Typography/Typopgraphy';
import InventorySelector from '../../src/Website/Containers/InventorySelector/InventorySelector';

const propertyStore = {
  loaded: true,
  marketingLayoutGroups: [
    {
      id: 'd5589400-780e-4817-bd93-f1f6f3f1bee7',
      name: '1bed',
      displayName: '1 bedroom',
      description: '',
      shortDisplayName: '1 bed',
      imageUrl: 'https://s3.amazonaws.com/red-staging-assets/staging/tenants/8b964792-1bce-4f78-af61-386e37d45d14/images/5a840efc-8500-4f19-a66c-a3ab30a68dce',
    },
    {
      id: '72baa5e8-1702-42f3-83ec-bfd9d6e6df8f',
      name: '2beds',
      displayName: '2 bedrooms',
      description: '',
      shortDisplayName: '2 beds',
      imageUrl: 'https://s3.amazonaws.com/red-staging-assets/staging/tenants/8b964792-1bce-4f78-af61-386e37d45d14/images/1121462f-ad68-40cb-b553-90abcaf060a1',
    },
    {
      id: '1be7b17f-b201-41c6-933e-3342b418921b',
      name: '3beds',
      displayName: '3 bedrooms',
      description: '',
      shortDisplayName: '3 beds',
      imageUrl: 'https://s3.amazonaws.com/red-staging-assets/staging/tenants/8b964792-1bce-4f78-af61-386e37d45d14/images/43238f7b-8210-4a19-a204-bceb214b2774',
    },
    {
      id: 'c595b853-3ece-4064-b0cf-865127c51cd9',
      name: '4beds',
      displayName: '4 bedrooms',
      description: '',
      shortDisplayName: '4 beds',
      imageUrl: 'https://s3.amazonaws.com/red-staging-assets/staging/tenants/8b964792-1bce-4f78-af61-386e37d45d14/images/d0dc649d-a62c-4f61-87cf-9b8a3667b706',
    },
  ],
  timezone: 'America/Los_Angeles',
  phone: '7632252675',
  layoutStore: {
    setMoveInDate: value => {
      console.log('setMoveInDate: ', value);
    },
    setSelectedMarketingLayoutGroup: value => {
      console.log('setSelectedMarketingLayoutGroup: ', value);
    },
    setSelectedInventoryId: value => {
      console.log('setSelectedInventoryId: ', value);
    },
    inventorySelected: {
      inventoryId: '8cf27c35-f755-4df5-aded-bd449ef630dc',
    },
    selectedLayouts: [
      {
        marketingLayoutId: 'e3cb5b69-3dd4-4ffd-8233-e731c18da644',
        name: 'ballantine',
        displayName: 'Ballantine',
        description: 'Open floor plan with massive bedroom, expansive windows, walk-in closet with built-in dresser and galley style kitchen.',
        numBedrooms: '2.0',
        numBathrooms: '1.0',
        surfaceArea: {
          min: '1922.00',
          max: '1922.00',
        },
        imageUrl:
          'https://s3.amazonaws.com/red-staging-assets/staging/tenants/8b964792-1bce-4f78-af61-386e37d45d14/images/af14c2eb-f90e-47ce-8b07-0947dd475723',
        inventory: [
          {
            inventoryId: 'eb629128-58f0-4bf5-b6c1-bb8ce71a8286',
            name: '1014',
            description: 'Our 700 sq. ft. luxuriously appointed Premiere One-Bedroom Suite features modern décor, soothing warm colours,',
            marketRent: 2042,
            fullQualifiedName: 'swparkme-350AR-1014',
            lowestMonthlyRent: 1837.8,
            buildingQualifiedName: '350AR-1014',
            imageUrl:
              'https://s3.amazonaws.com/red-staging-assets/staging/tenants/8b964792-1bce-4f78-af61-386e37d45d14/images/f5dfd2e0-331b-400b-8103-f327ebae8a96',
            amenities: [
              {
                name: 'Dishwasher Small',
                displayName: 'Dishwasher',
                subCategory: 'appliances',
                highValueFlag: false,
              },
              {
                name: 'ADA Accessible',
                displayName: 'ADA Accessible',
                subCategory: 'accessibility',
                highValueFlag: false,
              },
            ],
          },
          {
            inventoryId: '8cf27c35-f755-4df5-aded-bd449ef630dc',
            name: '1015',
            description: 'In addition to the spacious comfort of our Premiere One-Bedroom Suite, our Premiere Executive King Suite provides you with a den,',
            marketRent: 2042,
            availabilityDate: '2019-02-27T08:00:00.000Z',
            fullQualifiedName: 'swparkme-350AR-1015',
            lowestMonthlyRent: 1837.8,
            buildingQualifiedName: '350AR-1015',
            imageUrl:
              'https://s3.amazonaws.com/red-staging-assets/staging/tenants/8b964792-1bce-4f78-af61-386e37d45d14/images/f5dfd2e0-331b-400b-8103-f327ebae8a96',
            amenities: [
              {
                name: 'Dishwasher Small',
                displayName: 'Dishwasher',
                subCategory: 'appliances',
                highValueFlag: false,
              },
              {
                name: 'ADA Accessible',
                displayName: 'ADA Accessible',
                subCategory: 'accessibility',
                highValueFlag: false,
              },
            ],
          },
          {
            inventoryId: 'f3c40de5-509c-4267-87e9-5fcff32e1bf0',
            name: '1018',
            description: 'Nice place to stay',
            marketRent: 2042,
            availabilityDate: '2019-02-27T08:00:00.000Z',
            fullQualifiedName: 'swparkme-350AR-1018',
            lowestMonthlyRent: 1837.8,
            buildingQualifiedName: '350AR-1018',
            imageUrl:
              'https://s3.amazonaws.com/red-staging-assets/staging/tenants/8b964792-1bce-4f78-af61-386e37d45d14/images/f5dfd2e0-331b-400b-8103-f327ebae8a96',
            amenities: [
              {
                name: 'Dishwasher Small',
                displayName: 'Dishwasher',
                subCategory: 'appliances',
                highValueFlag: false,
              },
              {
                name: 'ADA Accessible',
                displayName: 'ADA Accessible',
                subCategory: 'accessibility',
                highValueFlag: false,
              },
            ],
          },
          {
            inventoryId: 'b5a93db0-6095-4c3e-98da-116073035a1d',
            name: '1016',
            description: "Very nice, you won't believe it!",
            marketRent: 2042,
            fullQualifiedName: 'swparkme-350AR-1016',
            lowestMonthlyRent: 1837.8,
            buildingQualifiedName: '350AR-1016',
            imageUrl:
              'https://s3.amazonaws.com/red-staging-assets/staging/tenants/8b964792-1bce-4f78-af61-386e37d45d14/images/f5dfd2e0-331b-400b-8103-f327ebae8a96',
            amenities: [],
          },
          {
            inventoryId: '201bb066-aa3f-40e5-8e76-7b4a2ca19823',
            name: '1017',
            description: 'Big Space',
            marketRent: 2042,
            fullQualifiedName: 'swparkme-350AR-1017',
            lowestMonthlyRent: 1837.8,
            buildingQualifiedName: '350AR-1017',
            imageUrl:
              'https://s3.amazonaws.com/red-staging-assets/staging/tenants/8b964792-1bce-4f78-af61-386e37d45d14/images/f5dfd2e0-331b-400b-8103-f327ebae8a96',
            amenities: [
              {
                name: 'Dishwasher Small',
                displayName: 'Dishwasher',
                subCategory: 'appliances',
                highValueFlag: false,
              },
              {
                name: 'ADA Accessible',
                displayName: 'ADA Accessible',
                subCategory: 'accessibility',
                highValueFlag: false,
              },
            ],
          },
        ],
      },
      {
        marketingLayoutId: '3973f1a1-f345-493e-b285-31816a87a3d6',
        name: 'abigton',
        displayName: 'Abigton',
        description: 'Open floor plan with massive bedroom, expansive windows, walk-in closet with built-in dresser and galley style kitchen.',
        numBedrooms: '3.0',
        numBathrooms: '2.0',
        surfaceArea: {
          min: '2195.00',
          max: '2495.00',
        },
        imageUrl:
          'https://s3.amazonaws.com/red-staging-assets/staging/tenants/8b964792-1bce-4f78-af61-386e37d45d14/images/052a60f9-3adc-4978-ab97-e7faa408be51',
        inventory: [],
      },
    ],
  },
};

const webSiteStore = {
  currentPropertyStore: propertyStore,
};

class Wrapper extends Component {
  render = () => (
    <Block>
      <div>
        <T.Header style={{ marginBottom: '3rem' }}>Inventory Selector</T.Header>
        <Provider webSiteStore={this.props.webSiteStore}>
          <InventorySelector />
        </Provider>
      </div>
    </Block>
  );
}

storiesOf('InventorySelector', module)
  .add('Layout Groups View', () => (
    <Wrapper
      webSiteStore={{
        ...webSiteStore,
        currentPropertyStore: {
          ...webSiteStore.currentPropertyStore,
          layoutStore: {
            ...webSiteStore.currentPropertyStore.layoutStore,
            shouldDisplayUnits: false,
            selectedMarketingLayoutGroupId: [],
          },
        },
      }}
    />
  ))
  .add('Layout Group View (one layout type)', () => (
    <Wrapper
      webSiteStore={{
        ...webSiteStore,
        currentPropertyStore: {
          ...webSiteStore.currentPropertyStore,
          marketingLayoutGroups: webSiteStore.currentPropertyStore.marketingLayoutGroups.slice(0, 1),
          layoutStore: {
            ...webSiteStore.currentPropertyStore.layoutStore,
            shouldDisplayUnits: true,
            selectedMarketingLayoutGroupId: ['d5589400-780e-4817-bd93-f1f6f3f1bee7'],
          },
        },
      }}
    />
  ))
  .add('Layout Group selected', () => (
    <Wrapper
      webSiteStore={{
        ...webSiteStore,
        currentPropertyStore: {
          ...webSiteStore.currentPropertyStore,
          layoutStore: {
            ...webSiteStore.currentPropertyStore.layoutStore,
            shouldDisplayUnits: true,
            selectedMarketingLayoutGroupId: ['d5589400-780e-4817-bd93-f1f6f3f1bee7'],
          },
        },
      }}
    />
  ));
