/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

/* eslint-disable react/prefer-stateless-function */
import React, { Component } from 'react';
import { storiesOf } from '@storybook/react';
import Field from '../../src/components/Field/Field';
import Block from '../helpers/Block';
import * as T from '../../src/components/Typography/Typopgraphy';
import TextBox from '../../src/components/TextBox/TextBox';

class Wrapper extends Component {
  state = {};

  handleChange = ({ value }) => {
    this.setState({ value });
  };

  render() {
    const { value } = this.state;
    return (
      <Block>
        <Field noMargin>
          <TextBox value={value} placeholder="Type some value" onChange={this.handleChange} />
        </Field>
        <Field noMargin columns={6}>
          <TextBox value={value} placeholder="Type here too" onChange={this.handleChange} />
        </Field>
        <Field>
          <T.Header>{value}</T.Header>
        </Field>
      </Block>
    );
  }
}

const iconAffordance = (
  <svg>
    <path
      style={{ fill: 'rgba(0, 0, 0, 0.54)' }}
      d="M9.5,3C13.1,3,16,5.9,16,9.5c0,1.6-0.6,3.1-1.6,4.2l0.3,0.3h0.8l5,5L19,20.5l-5-5v-0.8l-0.3-0.3c-1.1,1-2.6,1.6-4.2,1.6C5.9,16,3,13.1,3,9.5C3,5.9,5.9,3,9.5,3z M9.5,5C7,5,5,7,5,9.5C5,12,7,14,9.5,14C12,14,14,12,14,9.5C14,7,12,5,9.5,5z"
    />
  </svg>
);

storiesOf('TextBox', module)
  .add('Default', () => (
    <Block>
      <T.Text>TextBox Default</T.Text>
      <TextBox />
    </Block>
  ))
  .add('Clearable', () => (
    <Block>
      <T.Text>TextBox `clearable`</T.Text>
      <TextBox showClear />
    </Block>
  ))
  .add('with Placeholder', () => (
    <Block>
      <T.Text>TextBox with placeholder</T.Text>
      <TextBox placeholder="Type some text" />
    </Block>
  ))
  .add('with Placeholder and icon', () => (
    <Block>
      <T.Text>TextBox with placeholder and icon</T.Text>
      <TextBox placeholder="Type some text" iconAffordance={iconAffordance} />
    </Block>
  ))
  .add('with Placeholder and icon on the left', () => (
    <Block>
      <T.Text>TextBox with placeholder and icon on left</T.Text>
      <TextBox placeholder="Type some text" iconAffordance={iconAffordance} iconOnLeft />
    </Block>
  ))
  .add('wide', () => (
    <Block>
      <T.Text>wide prop makes the TextBox fill the container</T.Text>
      <TextBox wide placeholder="Type some text" />
    </Block>
  ))
  .add('multiline', () => (
    <Block>
      <T.Text>multiple lines</T.Text>
      <TextBox multiline placeholder="Type some text" />
    </Block>
  ))
  .add('multiple clearable', () => (
    <Block>
      <T.Text>multiple lines</T.Text>
      <TextBox multiline placeholder="Type some text" showClear />
    </Block>
  ))
  .add('showing an error message', () => (
    <Block>
      <T.Text>Showing an error message</T.Text>
      <TextBox placeholder="Type some text" defaultValue="Some error text" error="Please provide a valid name" />
    </Block>
  ))
  .add('css vars', () => (
    <Block style={{ '--reva-global-control-border-color': 'blue' }}>
      <TextBox />
    </Block>
  ))
  .add('controlled mode', () => <Wrapper />);
