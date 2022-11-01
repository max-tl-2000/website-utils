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

class Wrapper extends Component {
  render() {
    return (
      <Block>
        <Field noMargin>
          <T.Header>Header: The quick brown fox jumps over the lazy dog</T.Header>
        </Field>
        <Field noMargin>
          <T.Text>Text: The quick brown fox jumps over the lazy dog</T.Text>
        </Field>
        <Field noMargin>
          <T.Caption>Title: The quick brown fox jumps over the lazy dog</T.Caption>
        </Field>
        <Field noMargin>
          <T.Header secondary>Header: The quick brown fox jumps over the lazy dog</T.Header>
        </Field>
        <Field noMargin>
          <T.Text secondary>Text: The quick brown fox jumps over the lazy dog</T.Text>
        </Field>
        <Field noMargin>
          <T.Caption secondary>Title: The quick brown fox jumps over the lazy dog</T.Caption>
        </Field>

        <Field noMargin>
          <T.Header highlight>Header: The quick brown fox jumps over the lazy dog</T.Header>
        </Field>
        <Field noMargin>
          <T.Text highlight>Text: The quick brown fox jumps over the lazy dog</T.Text>
        </Field>
        <Field noMargin>
          <T.Caption highlight>Title: The quick brown fox jumps over the lazy dog</T.Caption>
        </Field>
        <Field noMargin>
          <T.Header error>Header: The quick brown fox jumps over the lazy dog</T.Header>
        </Field>
        <Field noMargin>
          <T.Text error>Text: The quick brown fox jumps over the lazy dog</T.Text>
        </Field>
        <Field noMargin>
          <T.Caption error>Title: The quick brown fox jumps over the lazy dog</T.Caption>
        </Field>

        <div style={{ background: 'black', padding: '5px 20px' }}>
          <Field noMargin>
            <T.Header lighterForeground>Header: The quick brown fox jumps over the lazy dog</T.Header>
          </Field>
          <Field noMargin>
            <T.Text lighterForeground>Text: The quick brown fox jumps over the lazy dog</T.Text>
          </Field>
          <Field noMargin>
            <T.Caption lighterForeground>Title: The quick brown fox jumps over the lazy dog</T.Caption>
          </Field>
          <Field noMargin>
            <T.Header lighterForeground secondary>
              Header: The quick brown fox jumps over the lazy dog
            </T.Header>
          </Field>
          <Field noMargin>
            <T.Text lighterForeground secondary>
              Text: The quick brown fox jumps over the lazy dog
            </T.Text>
          </Field>
          <Field noMargin>
            <T.Caption lighterForeground secondary>
              Title: The quick brown fox jumps over the lazy dog
            </T.Caption>
          </Field>

          <Field noMargin>
            <T.Header lighterForeground highlight>
              Header: The quick brown fox jumps over the lazy dog
            </T.Header>
          </Field>
          <Field noMargin>
            <T.Text lighterForeground highlight>
              Text: The quick brown fox jumps over the lazy dog
            </T.Text>
          </Field>
          <Field noMargin>
            <T.Caption lighterForeground highlight>
              Title: The quick brown fox jumps over the lazy dog
            </T.Caption>
          </Field>
          <Field noMargin>
            <T.Header lighterForeground error>
              Header: The quick brown fox jumps over the lazy dog
            </T.Header>
          </Field>
          <Field noMargin>
            <T.Text lighterForeground error>
              Text: The quick brown fox jumps over the lazy dog
            </T.Text>
          </Field>
          <Field noMargin>
            <T.Caption lighterForeground error>
              Title: The quick brown fox jumps over the lazy dog
            </T.Caption>
          </Field>
        </div>
      </Block>
    );
  }
}

storiesOf('WidgetTypography', module).add('Typography', () => <Wrapper />);
