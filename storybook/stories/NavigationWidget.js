/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

/* eslint-disable react/prefer-stateless-function */
import React, { Component } from 'react';
import { storiesOf } from '@storybook/react';
import Block from '../helpers/Block';
import * as T from '../../src/components/Typography/Typopgraphy';
import Navigation from '../../src/Website/Containers/Navigation/Navigation';
import { groupedRegions } from '../resources/properties.js';
import { ResizableContainer } from '../helpers/ResizableHelper';

const actions = {
  onNavigationItemClick: item => console.log('Navigation item clicked', item),
};

const webSiteStore = {
  loaded: true,
  columnTitle: 'state',
  columnValue: 'city',
  groupedRegions,
};

class Wrapper extends Component {
  render() {
    return (
      <Block>
        <T.Header style={{ marginBottom: '3rem' }}>Footer navigation widget example</T.Header>
        <T.Text>Resize the container to test the resposive behavior</T.Text>
        <ResizableContainer width={600} height={400}>
          <Navigation webSiteStore={webSiteStore} actions={actions} />
        </ResizableContainer>
      </Block>
    );
  }
}

class Wrapper2 extends Component {
  constructor(props) {
    super(props);
    this.webSiteStore = {
      loading: true,
      columnTitle: 'state',
      columnValue: 'city',
      groupedRegions,
    };
  }

  render() {
    return (
      <Block>
        <T.Header style={{ marginBottom: '3rem' }}>Footer navigation widget example</T.Header>
        <T.Text>Resize the container to test the resposive behavior</T.Text>
        <ResizableContainer width={600} height={400}>
          <Navigation webSiteStore={this.webSiteStore} actions={actions} />
        </ResizableContainer>
      </Block>
    );
  }
}

storiesOf('Footer navigation', module)
  .add('loaded state', () => <Wrapper />)
  .add('loading state', () => <Wrapper2 />);
