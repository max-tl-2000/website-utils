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
import Field from '../../src/components/Field/Field';
import TextBox from '../../src/components/TextBox/TextBox';
import Button from '../../src/components/Button/Button';
import * as W from '../../src/components/Wizard/Wizard';
import * as T from '../../src/components/Typography/Typopgraphy';
import Dropdown from '../../src/components/Dropdown/Dropdown';

class Wrapper extends Component {
  state = { index: 0 };

  items = [{ id: 'some', value: 'value' }, { id: 'foo', value: 'bar' }];

  handleChange = ({ value }) => {
    this.setState({ value });
  };

  commitValue = () => {
    this.setState(prevState => ({ index: parseInt(prevState.expectedIndex, 10) }));
  };

  handleIndexChange = ({ value }) => {
    this.setState({ expectedIndex: value });
  };

  setSelected = selectedId => {
    this.setState({ selectedId });
  };

  render() {
    const { value, index, expectedIndex, selectedId } = this.state;
    return (
      <Block>
        <W.Wizard index={index}>
          <W.Step title="Provide contact information" subTitle="Enter your contact information below and we'll be in touch with you shortly">
            <Field noMargin>
              <TextBox value={value} placeholder="Type some value" onChange={this.handleChange} />
            </Field>
            <Field noMargin columns={6}>
              <Dropdown />
            </Field>
            <Field noMargin columns={6}>
              <Dropdown wide placeholder="Please select one" items={this.items} selectedId={selectedId} onChange={this.setSelected} />
            </Field>
            <Field>
              <T.Text>{selectedId}</T.Text>
            </Field>
          </W.Step>
          <W.Step>Step 3</W.Step>
        </W.Wizard>

        <Field columns={4} style={{ marginTop: '2rem' }}>
          <TextBox value={expectedIndex} wide placeholder="Change index" onChange={this.handleIndexChange} />
        </Field>
        <Field columns={6} last>
          <Button label="Set Index" onClick={this.commitValue} />
        </Field>
      </Block>
    );
  }
}

storiesOf('WidgetWizard', module).add('Wizard', () => <Wrapper />);
