/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

/* eslint-disable react/prefer-stateless-function */
import React, { Component } from 'react';
import { storiesOf } from '@storybook/react';
import { Provider } from 'mobx-react';
import Block from '../helpers/Block';
import * as T from '../../src/components/Typography/Typopgraphy';
import SearchResultList from '../../src/Website/Containers/SearchResultList/SearchResultList';
import { properties as sampleProperties } from '../resources/fixtures';
import { ResizableContainer } from '../helpers/ResizableHelper';

const actions = {
  onPropertyClick: item => console.log('Property clicked', item),
};

const searchStoreWithExactResults = {
  loaded: true,
  displayRelatedResults: false,
  resultsCount: 6,
  searchResults: sampleProperties,
};

const searchStoreWithNoExactResults = {
  loaded: true,
  displayRelatedResults: true,
  resultsCount: 0,
  searchResults: sampleProperties,
};

const searchStoreLoading = {
  loaded: false,
  loading: true,
};

const screenSizeStore = {
  matchMedium: true,
};

class Wrapper extends Component {
  render() {
    return (
      <Block>
        <T.Header style={{ marginBottom: '3rem' }}>Search Results widget</T.Header>
        <Provider searchStore={this.props.searchStore} screenSizeStore={screenSizeStore} actions={actions}>
          <ResizableContainer width={600} height={400}>
            <SearchResultList usePropertyImageHelper={false} />
          </ResizableContainer>
        </Provider>
      </Block>
    );
  }
}

storiesOf('SearchResultListWidget', module)
  .add('SearchResultList exact match', () => <Wrapper searchStore={searchStoreWithExactResults} />)
  .add('SearchResultList without exact match', () => <Wrapper searchStore={searchStoreWithNoExactResults} />)
  .add('SearchResultList loading', () => <Wrapper searchStore={searchStoreLoading} />);
