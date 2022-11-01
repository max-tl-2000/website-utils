/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

import QuestionsPageModel from '../../src/Models/QuestionsPageModel';

const MARKETING_LAYOUT_GROUPS = {
  STUDIO: {
    id: '41214aa1-9a87-422a-bf6c-30eb2358b9e3',
    name: 'studio',
    displayName: 'Studio',
    shortDisplayName: 'Studio',
    imageUrl: 'https://s3.amazonaws.com/red-staging-assets/staging/tenants/778a8f7c-6179-4193-a0fa-94149433beed/images/62d38f5d-b9dc-4e95-ae41-2f8011b87e1c',
  },
  ONE_BEDROOM: {
    id: 'f410c682-33ca-11e9-b66d-ff29bdeb2323',
    name: '1bed',
    displayName: '1 bedroom',
    shortDisplayName: '1 bed',
    imageUrl: 'https://s3.amazonaws.com/red-staging-assets/staging/tenants/778a8f7c-6179-4193-a0fa-94149433beed/images/bd88a729-4d7e-444e-9cda-93add19f65cb',
  },
  TWO_BEDROOM: {
    id: 'a2daf2dd-4a92-4cae-80af-bf6afd961df4',
    name: '2beds',
    displayName: '2 bedrooms',
    shortDisplayName: '2 beds',
    imageUrl: 'https://s3.amazonaws.com/red-staging-assets/staging/tenants/778a8f7c-6179-4193-a0fa-94149433beed/images/9edbd213-332a-405b-b958-93529c76ac62',
  },
  THREE_BEDROOM: {
    id: 'ed4c346c-33ca-11e9-8f3a-4753eb48edb9',
    name: '3beds',
    displayName: '3 bedrooms',
    shortDisplayName: '3 beds',
    imageUrl: 'https://s3.amazonaws.com/red-staging-assets/staging/tenants/778a8f7c-6179-4193-a0fa-94149433beed/images/9edbd213-332a-405b-b958-93529c7674fa',
  },
};

const oneAndTwoBedroomLayoutProperty = {
  numBedrooms: ['ONE_BED', 'TWO_BEDS'],
  marketingLayoutGroups: [MARKETING_LAYOUT_GROUPS.ONE_BEDROOM, MARKETING_LAYOUT_GROUPS.TWO_BEDROOM],
};

const studioAndBedroomLayoutsProperty = {
  numBedrooms: ['STUDIO', 'ONE_BED', 'TWO_BEDS', 'THREE_BEDS'],
  marketingLayoutGroups: [
    MARKETING_LAYOUT_GROUPS.STUDIO,
    MARKETING_LAYOUT_GROUPS.ONE_BEDROOM,
    MARKETING_LAYOUT_GROUPS.TWO_BEDROOM,
    MARKETING_LAYOUT_GROUPS.THREE_BEDROOM,
  ],
};

const onlyBedroomLayoutProperty = {
  numBedrooms: ['ONE_BED', 'TWO_BEDS', 'THREE_BEDS'],
  marketingLayoutGroups: [MARKETING_LAYOUT_GROUPS.ONE_BEDROOM, MARKETING_LAYOUT_GROUPS.TWO_BEDROOM, MARKETING_LAYOUT_GROUPS.THREE_BEDROOM],
};

export const singleLayoutProperty = {
  numBedrooms: ['STUDIO'],
  marketingLayoutGroups: [MARKETING_LAYOUT_GROUPS.STUDIO],
};

export const properties = [
  {
    propertyId: '190df0d0-87d6-484f-a4a2-47db904710cd',
    name: 'swparkme',
    displayName: 'Parkmerced Apartments',
    imageUrl: '/assets/properties/parkmerced.jpg',
    ...studioAndBedroomLayoutsProperty,
    geoLocation: { lat: 37.445099, lng: -122.160362 },
    surfaceArea: { min: 577, max: 1412 },
    marketRent: { min: 1460, max: 5680 },
    city: 'San Francisco',
    tags: ['3DTour', 'video'],
    state: 'California',
    region: '',
    address: '135 Greenview Road',
    neighborhood: '',
    testimonials: ['Kids have lots of friends at the park around the corner'],
    phone: '15735550133',
    email: 'marketing@property.com',
  },
  {
    propertyId: '7e8b8cf8-9641-44e6-94c5-39c27b55c328',
    name: 'Sharon',
    displayName: 'Sharon Green',
    imageUrl: '/assets/properties/sharon.jpg',
    ...oneAndTwoBedroomLayoutProperty,
    geoLocation: { lat: 37.90642, lng: -122.5027 },
    surfaceArea: { min: 470, max: 1350 },
    marketRent: { min: 1350, max: 2800 },
    city: 'New York',
    tags: ['3DTour', 'video'],
    state: 'New York',
    region: '',
    address: '700 Lincoln Village Circle',
    neighborhood: '',
    testimonials: ['Great staff with lots of organized activities'],
    phone: '12565558925',
    email: 'marketing@property.com',
  },
  {
    propertyId: 'f643c872-0437-4fcc-ba12-7f2af15f1c30',
    name: 'B',
    displayName: 'Creekside Apts',
    imageUrl: '/assets/properties/creekside.jpg',
    ...onlyBedroomLayoutProperty,
    geoLocation: { lat: 37.85183, lng: -122.273615 },
    surfaceArea: { min: 880, max: 1960 },
    marketRent: { min: 2800, max: 3640 },
    city: 'Queens',
    tags: ['3DTour', 'video'],
    state: 'New York',
    region: '',
    address: '38 Cherry Dr.',
    neighborhood: '',
    testimonials: ['Property is near hospitals, schools and supermarkets'],
    phone: '14255558756',
    email: 'marketing@property.com',
  },
  {
    propertyId: 'a705ddd7-119b-4993-a53a-d1a7a04582e4',
    name: 'cove',
    displayName: 'The Cove at Tiburon',
    imageUrl: '/assets/properties/cove.jpg',
    ...oneAndTwoBedroomLayoutProperty,
    geoLocation: { lat: 37.503177, lng: -122.252768 },
    surfaceArea: { min: 365, max: 890 },
    marketRent: { min: 1950, max: 4270 },
    city: 'Miami',
    tags: ['3DTour', 'video'],
    state: 'Florida',
    region: '',
    address: '7979 Devonshire St.',
    neighborhood: '',
    testimonials: ['The included amenities and services are great'],
    phone: '15215555006',
    email: 'marketing@property.com',
  },
  {
    propertyId: 'fc7e125a-9d56-4529-a5a0-75f27fdaf101',
    name: 'A',
    displayName: 'Pinewood Apts',
    imageUrl: '/assets/properties/pinewood.jpg',
    ...onlyBedroomLayoutProperty,
    geoLocation: { lat: 37.660913, lng: -122.477417 },
    surfaceArea: { min: 360, max: 1250 },
    marketRent: { min: 3420, max: 6800 },
    city: 'Isanti',
    tags: ['3DTour', 'video'],
    state: 'Minnesota',
    region: '',
    address: '202 W. Pine St.',
    neighborhood: '',
    testimonials: ['Hang at the pool with friends all the time'],
    phone: '15625557844',
    email: 'marketing@property.com',
  },
  {
    propertyId: '1895de3a-33c0-11e9-818b-973d01bcbf67',
    name: 'A',
    displayName: 'Bay Apts',
    imageUrl: '/assets/properties/bay.jpg',
    ...studioAndBedroomLayoutsProperty,
    geoLocation: { lat: 37.376856, lng: -122.044441 },
    surfaceArea: { min: 650, max: 2450 },
    marketRent: { min: 1280, max: 3750 },
    city: 'San Francisco',
    tags: ['video'],
    state: 'California',
    region: '',
    address: '858 Wilbur St.',
    neighborhood: '',
    testimonials: ['Beautiful property near the center of town'],
    phone: '16415550024',
    email: 'marketing@property.com',
  },
];

const propertiesGeoLocations = {
  NewYork: [
    { lat: 40.748115, lng: -74.003569 },
    { lat: 40.752081, lng: -73.986481 },
    { lat: 40.753514, lng: -73.978485 },
    { lat: 40.773756, lng: -73.963352 },
    { lat: 40.776778, lng: -73.976185 },
    { lat: 40.792332, lng: -73.945723 },
    { lat: 40.763414, lng: -73.926698 },
    { lat: 40.763414, lng: -73.926698 },
    { lat: 40.752625, lng: -73.935712 },
    { lat: 40.750081, lng: -73.947793 },
    { lat: 40.733379, lng: -73.954463 },
    { lat: 40.68824, lng: -73.970341 },
    { lat: 40.732261, lng: -73.804458 },
    { lat: 40.73476, lng: -73.776168 },
    { lat: 40.737727, lng: -73.77635 },
    { lat: 40.756717, lng: -73.783676 },
    { lat: 40.759633, lng: -73.797872 },
    { lat: 40.768117, lng: -73.797597 },
    { lat: 40.67113, lng: -73.727684 },
    { lat: 40.674342, lng: -73.712096 },
    { lat: 40.67671, lng: -73.721913 },
    { lat: 40.66377, lng: -73.730986 },
    { lat: 40.659855, lng: -73.737466 },
    { lat: 40.636579, lng: -73.718522 },
  ],
  Chicago: [
    { lat: 41.978061, lng: -87.716661 },
    { lat: 41.970962, lng: -87.712839 },
    { lat: 41.969987, lng: -87.694344 },
    { lat: 41.969163, lng: -87.683598 },
    { lat: 41.933221, lng: -87.77083 },
    { lat: 41.932822, lng: -87.795204 },
    { lat: 41.771222, lng: -88.336211 },
    { lat: 41.77335, lng: -88.339601 },
    { lat: 41.780263, lng: -88.345824 },
    { lat: 41.760919, lng: -87.575591 },
    { lat: 41.765288, lng: -87.566697 },
    { lat: 41.771842, lng: -87.569647 },
  ],
};

const getRndInteger = (min = 0, max = 100) => Math.floor(Math.random() * (max - min)) + min;

const getAdditionalProperties = (propertiesLatLng = []) => {
  const additionalProperties = [];

  for (let i = 0; i < propertiesLatLng.length; i++) {
    const property = { ...properties[getRndInteger(0, properties.length)] };
    property.geoLocation = propertiesLatLng[i];

    additionalProperties.push(property);
  }

  return additionalProperties;
};

const createAdditionalProperties = () => [
  ...getAdditionalProperties(propertiesGeoLocations.NewYork),
  ...getAdditionalProperties(propertiesGeoLocations.Chicago),
];

export const extendedProperties = [...properties, ...createAdditionalProperties()];

export const propertyCardActions = {
  onPropertyClick: ({ displayName }) => console.log(`Navigate to ${displayName}`),
  on3DTourClick: ({ displayName }, e = {}) => {
    console.log(`Navigate to ${displayName} 3D tour`);
    e.stopPropagation && e.stopPropagation();
  },
};

export const mockPropertyAssets = {
  pictures: [
    {
      source: 'https://media-cdn.tripadvisor.com/media/photo-s/0d/b5/02/ab/apartament-de-lux.jpg',
      alt: 'Picture 1',
    },
    {
      source: 'https://37b3a77d7df28c23c767-53afc51582ca456b5a70c93dcc61a759.ssl.cf3.rackcdn.com/640x480/54850_3971_001.jpg',
      alt: 'Picture 2',
    },
    {
      source:
        'https://static1.squarespace.com/static/5a8210b6cd39c34fde7d3562/t/5a94957be2c4839ef3f50993/1526653689360/Spacious%2C+Private+SF+Townhomes?format=1500w',
      alt: 'Picture 3',
    },
  ],
  videos: [
    {
      source: 'https://www.youtube.com/embed/Ju6kx6E32WA',
    },
    {
      source: 'https://www.youtube.com/embed/Ju6kx6E32WA',
    },
  ],
  tours: [
    {
      source: 'https://my.matterport.com/show/?model=U1vHeQjKZ99',
    },
    {
      source: 'https://my.matterport.com/show/?model=U1vHeQjKZ99',
    },
  ],
};

export const mockPropertyImagesAndTours = {
  pictures: [
    {
      source: 'https://media-cdn.tripadvisor.com/media/photo-s/0d/b5/02/ab/apartament-de-lux.jpg',
      alt: 'Picture 1',
    },
    {
      source: 'https://37b3a77d7df28c23c767-53afc51582ca456b5a70c93dcc61a759.ssl.cf3.rackcdn.com/640x480/54850_3971_001.jpg',
      alt: 'Picture 2',
    },
    {
      source:
        'https://static1.squarespace.com/static/5a8210b6cd39c34fde7d3562/t/5a94957be2c4839ef3f50993/1526653689360/Spacious%2C+Private+SF+Townhomes?format=1500w',
      alt: 'Picture 3',
    },
  ],
  videos: [],
  tours: [
    {
      source: 'https://my.matterport.com/show/?model=U1vHeQjKZ99',
    },
    {
      source: 'https://my.matterport.com/show/?model=U1vHeQjKZ99',
    },
  ],
};

export const mockPropertyTours = {
  pictures: [],
  videos: [],
  tours: [
    {
      source: 'https://my.matterport.com/show/?model=U1vHeQjKZ99',
    },
    {
      source: 'https://my.matterport.com/show/?model=U1vHeQjKZ99',
    },
  ],
};

export const mockPropertyImages = {
  pictures: [
    {
      source: 'https://media-cdn.tripadvisor.com/media/photo-s/0d/b5/02/ab/apartament-de-lux.jpg',
      alt: 'Picture 1',
    },
    {
      source: 'https://37b3a77d7df28c23c767-53afc51582ca456b5a70c93dcc61a759.ssl.cf3.rackcdn.com/640x480/54850_3971_001.jpg',
      alt: 'Picture 2',
    },
  ],
  videos: [],
  tours: [],
};

export const mockLeaseTerms = {
  availabilityDate: '2019-03-20',
  terms: [
    {
      marketRent: '5030.00',
      termLength: 12,
      period: 'month',
    },
    {
      marketRent: '5630.00',
      termLength: 6,
      period: 'month',
    },
    {
      marketRent: '4510.00',
      termLength: 10,
      period: '',
    },
  ],
  aditionalTerms: [
    {
      marketRent: '7390.00',
      termLength: 3,
      period: '',
    },
    {
      marketRent: '7380.00',
      termLength: 4,
      period: '',
    },
    {
      marketRent: '6210.00',
      termLength: 5,
      period: '',
    },
    {
      marketRent: '4865.00',
      termLength: 7,
      period: '',
    },
    {
      marketRent: '4505.00',
      termLength: 8,
      period: '',
    },
    {
      marketRent: '4500.00',
      termLength: 9,
      period: 'month',
    },
    {
      marketRent: '4505.00',
      termLength: 11,
      period: '',
    },
    {
      marketRent: '4500.00',
      termLength: 13,
      period: '',
    },
    {
      marketRent: '5650.00',
      termLength: 14,
      period: '',
    },
  ],
};

const sectionQuestion1 = 'Do you need additional drinks?';
const sectionQuestion2 = 'Do you need additional food?';
const sectionData = [
  {
    id: 'e0ac3444-c87c-4b99-918a-492960c13eb1',
    name: 'parking',
    displaySectionQuestion: sectionQuestion1,
    displayPrimaryQuestion: 'Do you need additional beers?',
    displayPrimaryQuestionDescription: '',
    displayFollowupQuestion: 'How many beers do you need?',
    inputTypeForFollowupQuestion: 'count',
  },
  {
    id: '80d479b8-9d49-4e51-a2e0-074d5b709a21',
    name: 'pet',
    displaySectionQuestion: sectionQuestion1,
    displayPrimaryQuestion: 'Do you need additional whiskey?',
    displayPrimaryQuestionDescription: 'Please be aware that we only allow single malt whiskey!',
    displayFollowupQuestion: 'How many whiskeys do you need?',
    inputTypeForFollowupQuestion: 'count',
  },
  {
    id: '45ac0818-99e1-43cc-9598-be4e03f486fd',
    name: 'storage',
    displaySectionQuestion: sectionQuestion1,
    displayPrimaryQuestion: 'Do you need additional rum?',
    displayPrimaryQuestionDescription: '',
    displayFollowupQuestion: 'How many rums do you need?',
    inputTypeForFollowupQuestion: 'count',
  },
  {
    id: '80d479b8-9d49-4e51-a2e0-074d5b709a21',
    name: 'pet',
    displaySectionQuestion: sectionQuestion2,
    displayPrimaryQuestion: 'Do you need additional potatos?',
    displayPrimaryQuestionDescription: '',
    displayFollowupQuestion: 'How many potatos do you need?',
    inputTypeForFollowupQuestion: 'count',
  },
  {
    id: '45ac0818-99e1-43cc-9598-be4e03f486fd',
    name: 'storage',
    displaySectionQuestion: sectionQuestion2,
    displayPrimaryQuestion: 'Do you need additional cheeses?',
    displayPrimaryQuestionDescription: '',
    displayFollowupQuestion: 'How many cheeses do you need?',
    inputTypeForFollowupQuestion: 'count',
  },
  {
    id: '45ac0818-99e1-43cc-9598-be4e03f486fd',
    name: 'storage',
    displaySectionQuestion: '',
    displayPrimaryQuestion: '',
    displayPrimaryQuestionDescription: '',
    displayFollowupQuestion: 'How much do you like this component?',
    inputTypeForFollowupQuestion: 'count',
  },
];

export const questionsPageModel = new QuestionsPageModel(sectionData);
