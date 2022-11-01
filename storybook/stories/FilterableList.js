/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

import React, { Component } from 'react';
import { storiesOf } from '@storybook/react';
import { observer } from 'mobx-react';
import FilterableList from '../../src/components/Filterable/FilterableList';
import * as T from '../../src/components/Typography/Typopgraphy';

const listItems = {
  FOUND_ANOTHER_PLACE: 'CLOSE_PARTY_REASON_FOUND_ANOTHER_PLACE',
  NO_LONGER_MOVING: 'CLOSE_PARTY_REASON_NO_LONGER_MOVING',
  NOT_INTERESTED: 'CLOSE_PARTY_REASON_NOT_INTERESTED',
  NO_INVENTORY_MATCH: 'CLOSE_PARTY_REASON_NO_INVENTORY_MATCH',
  CANT_AFFORD: 'CLOSE_PARTY_REASON_CANT_AFFORD',
  NO_RESPONSE: 'CLOSE_PARTY_REASON_NO_RESPONSE',
  INITIAL_HANGUP: 'CLOSE_PARTY_REASON_INITIAL_HANGUP',
  ALREADY_A_RESIDENT: 'CLOSE_PARTY_REASON_ALREADY_A_RESIDENT',
  NOT_LEASING_BUSINESS: 'CLOSE_PARTY_REASON_NOT_LEASING_BUSINESS',
  MARKED_AS_SPAM: 'CLOSE_PARTY_REASON_MARKED_AS_SPAM',
  REVA_TESTING: 'CLOSE_PARTY_REASON_REVA_TESTING',
  NO_MEMBERS: 'CLOSE_PARTY_REASON_NO_MEMBERS',
  MERGED_WITH_ANOTHER_PARTY: 'CLOSE_PARTY_REASON_MERGED_WITH_ANOTHER_PARTY',
  CLOSED_DURING_IMPORT: 'CLOSE_PARTY_REASON_CLOSED_DURING_IMPORT',
  BLOCKED_CONTACT: 'CLOSE_PARTY_REASON_BLOCKED_CONTACT',
};

const dummyItems = Object.keys(listItems).reduce((acc, key) => {
  acc.push({ id: key, text: listItems[key] });
  return acc;
}, []);

@observer
class Wrapper extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  doOnItemSelect = (item, args = {}) => {
    // prevent the selection of the item that match this id
    args.cancel = item.id === 'NO_LONGER_MOVING';
  };

  handleOnChange = selected => {
    this.setState({ selectedId: selected.id });
  };

  render() {
    const { selectedId } = this.state;
    return (
      <div style={{ padding: '20px 25px' }}>
        <T.Text>{`The following is an example of the FilterableList. This component presents to the end user a list of options which can
          be selected. The selection can be prevented by setting \`args.cancel=true\` on the \`onItemSelect(item, args)\` handler`}</T.Text>
        <T.Text>{'In this example you cannot select `CLOSE_PARTY_REASON_NO_LONGER_MOVING`'}</T.Text>
        <FilterableList items={dummyItems} selectedIds={selectedId} onItemSelect={this.doOnItemSelect} onChange={this.handleOnChange} />
        <pre>
          <code>{selectedId}</code>
        </pre>
      </div>
    );
  }
}

storiesOf('FilterableList', module).add('FilterableList', () => <Wrapper />);
