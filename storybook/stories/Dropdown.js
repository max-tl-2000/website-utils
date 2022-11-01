/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

import React, { Component } from 'react';
import { storiesOf } from '@storybook/react';
import { observable, action } from 'mobx';
import Block from '../helpers/Block';
import Dropdown from '../../src/components/Dropdown/Dropdown';

class DrodpownWrapper extends Component {
  @observable
  selectedId = undefined;

  items = [{ id: 'some', value: 'value' }, { id: 'foo', value: 'bar' }, { id: 'another value', value: 'A complex and longer option to pick' }];

  @action
  setSelected = selectedId => {
    this.selectedId = selectedId;
  };

  render() {
    return <Dropdown placeholder="Please select one" items={this.items} selectedId={this.selectedId} onChange={this.setSelected} />;
  }
}

storiesOf('Dropdown', module).add('dropdown', () => (
  <Block style={{ '--reva-global-control-border-color': 'blue' }}>
    <DrodpownWrapper />
  </Block>
));
