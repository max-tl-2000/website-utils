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
import { properties as sampleProperties, propertyCardActions } from '../resources/fixtures';
import ResponsivePropertyCardGrid from '../../src/Website/Containers/PropertyCardGrid/ResponsivePropertyCardGrid';
import { ResizableContainer } from '../helpers/ResizableHelper';

const { onPropertyClick, on3DTourClick } = propertyCardActions;

class Wrapper extends Component {
  render() {
    const { wrapperSize = 1200, title } = this.props;

    return (
      <Block>
        <T.Title>Property Card Grid - {title}</T.Title>
        <ResizableContainer width={wrapperSize} height={800}>
          <ResponsivePropertyCardGrid
            properties={sampleProperties}
            onPropertyClick={onPropertyClick}
            on3DTourClick={on3DTourClick}
            usePropertyImageHelper={false}
          />
        </ResizableContainer>
      </Block>
    );
  }
}

storiesOf('PropertyCardGrid', module)
  .add('Fit to container', () => <Wrapper title={'Fit to container'} />)
  .add('Single Column', () => <Wrapper wrapperSize={400} title={'Single Column'} />)
  .add('Two Columns', () => <Wrapper wrapperSize={800} title={'Two Columns'} />)
  .add('Three Columns', () => <Wrapper wrapperSize={1100} title={'Three Columns'} />);
