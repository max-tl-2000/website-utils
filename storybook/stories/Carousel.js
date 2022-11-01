/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

/* eslint-disable react/prefer-stateless-function */
import React, { Component } from 'react';
import { storiesOf } from '@storybook/react';
import { mockPropertyTours, mockPropertyImagesAndTours, mockPropertyImages, mockPropertyAssets } from '../resources/fixtures';
import Carousel from '../../src/components/Carousel/Carousel';

class Wrapper extends Component {
  render() {
    return (
      <div style={{ width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column' }}>
        <div
          style={{
            width: '380px',
            border: '1px solid red',
            margin: '1em',
          }}>
          <Carousel {...mockPropertyAssets} noBtnLabels />
        </div>
        <div
          style={{
            width: '480px',
            border: '1px solid red',
            margin: '1em',
          }}>
          <Carousel {...mockPropertyAssets} />
        </div>
        <div
          style={{
            width: '840px',
            border: '1px solid red',
            margin: '1em',
          }}>
          <Carousel {...mockPropertyAssets} />
        </div>
        <div
          style={{
            width: '480px',
            border: '1px solid red',
            margin: '1em',
          }}>
          <Carousel {...mockPropertyImages} />
        </div>
        <div
          style={{
            width: '480px',
            border: '1px solid red',
            margin: '1em',
          }}>
          <Carousel {...mockPropertyImagesAndTours} />
        </div>
        <div
          style={{
            width: '480px',
            border: '1px solid red',
            margin: '1em',
          }}>
          <Carousel {...mockPropertyTours} />
        </div>
      </div>
    );
  }
}

storiesOf('Carousel', module).add('Carousels in different sizes', () => <Wrapper />);
