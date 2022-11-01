/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

/* eslint-disable react/prefer-stateless-function */
import React from 'react';
import { storiesOf } from '@storybook/react';
import Block from '../helpers/Block';
import * as T from '../../src/components/Typography/Typopgraphy';
import Picture from '../../src/components/Picture/Picture';

const caption = () => <div style={{ position: 'absolute', bottom: 0, left: 0, 'font-size': '12px' }}>This is the caption!</div>;

storiesOf('Picture', module)
  .add('Picture simple example', () => (
    <Block>
      <T.Title>Simple example</T.Title>
      <Picture style={{ width: 200, height: 320 }} src={`${window.location.origin}/assets/snoopy.jpg`} />
    </Block>
  ))
  .add('Picture remote origin', () => (
    <Block>
      <T.Title>Simple example</T.Title>
      <Picture style={{ width: 200, height: 320 }} src={'https://upload.wikimedia.org/wikipedia/en/thumb/5/53/Snoopy_Peanuts.png/200px-Snoopy_Peanuts.png'} />
    </Block>
  ))
  .add('Picture error example', () => (
    <Block>
      <T.Title>Image load error example</T.Title>
      <Picture style={{ width: 200, height: 320 }} imageFailedText="Image failed to load" src={`${window.location.origin}/snoopy.jpgx`} />
    </Block>
  ))
  .add('Picture with caption', () => (
    <Block>
      <T.Title>Image with caption</T.Title>
      <Picture
        style={{ width: 200, height: 320 }}
        src={'https://upload.wikimedia.org/wikipedia/en/thumb/5/53/Snoopy_Peanuts.png/200px-Snoopy_Peanuts.png'}
        caption={caption}
      />
    </Block>
  ));
