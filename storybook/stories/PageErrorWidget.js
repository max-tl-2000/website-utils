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
import PageErrorWidget from '../../src/Website/Containers/PageErrorWidget/PageErrorWidget';

const webSiteStoreWithErrors = {
  storesFailed: true,
};

class Wrapper extends Component {
  render() {
    const { title, webSiteStore = {} } = this.props;

    return (
      <Block>
        <T.Title>{title}</T.Title>
        <PageErrorWidget webSiteStore={webSiteStore} />
        <div style={{ width: '100%', height: '480px', background: '#EEEDED' }}>
          <h1 style={{ margin: '0 10px' }}>Page Content</h1>
          <ul>
            <li>Section 1</li>
            <li>Section 2</li>
            <li>Section 3</li>
          </ul>
        </div>
      </Block>
    );
  }
}

storiesOf('PageErrorWidget', module)
  .add('Page with error', () => <Wrapper title={'Page With Error'} webSiteStore={webSiteStoreWithErrors} />)
  .add('Page with no error', () => <Wrapper title={'Page With No Error'} />);
