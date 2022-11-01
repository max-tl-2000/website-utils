/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

/* eslint-disable react/prefer-stateless-function */
import React, { Component } from 'react';
import { storiesOf } from '@storybook/react';

import Button from '../../src/components/Button/Button';
import InventoryDialog from '../../src/Website/Containers/InventoryDialog/InventoryDialog';
import { mockPropertyAssets, mockPropertyImages, questionsPageModel, mockLeaseTerms } from '../resources/fixtures';

const propertyStore = {
  price: '$2550',
  propertyName: '204-231',
  amenities: ['Pool view', 'Separate garage', 'Dishwasher'],
  ...mockPropertyAssets,
  questionsPageModel,
  mockLeaseTerms,
};

const propertyStoreImagesOnly = {
  price: '$2550',
  propertyName: '204-231',
  amenities: ['Pool view', 'Separate garage', 'Dishwasher'],
  ...mockPropertyImages,
  questionsPageModel,
  mockLeaseTerms,
};

class Wrapper extends Component {
  constructor() {
    super();
    this.state = {
      isDialogOpen: false,
    };
  }

  handleDone = () => this.setState({ isDialogOpen: false });

  openDialog = () => this.setState({ isDialogOpen: true });

  render() {
    const { isDialogOpen } = this.state;
    return (
      <div>
        <Button label={'Open Dialog'} onClick={this.openDialog} />
        <InventoryDialog webSiteStore={this.props.propertyStore} isOpen={isDialogOpen} />
      </div>
    );
  }
}

storiesOf('Dialogs', module)
  .add('Get your perfect apartment - only images', () => <Wrapper propertyStore={propertyStoreImagesOnly} />)
  .add('Get your perfect apartment - all media', () => <Wrapper propertyStore={propertyStore} />);
