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
import SearchFilterLoadingPlaceholder from '../../src/Website/Containers/SearchFilters/SearchFilterLoadingPlaceholder';

class Wrapper extends Component {
  render() {
    return (
      <Block>
        <T.Header style={{ marginBottom: '3rem' }}>Loader Placeholder</T.Header>
        <SearchFilterLoadingPlaceholder />
      </Block>
    );
  }
}

storiesOf('SearchFilterLoadingPlaceholder', module).add('SearchFilterLoadingPlaceholder', () => <Wrapper />);
