/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

/* eslint-disable react/no-multi-comp */
import React, { Component } from 'react';
import { storiesOf } from '@storybook/react';
import Field from '../../src/components/Field/Field';
import * as T from '../../src/components/Typography/Typopgraphy';
import DateSelector from '../../src/components/DateSelector/DateSelector';
import Block from '../helpers/Block';
import { now } from '../../src/common/moment-utils';

const getDateSelectorClass = ({ disabled, disabledDates, min, max, horizontal, modal } = {}) => {
  const isDateInThePast = day => {
    const today = now({ timezone: 'America/Los_Angeles' });
    return day.isBefore(today, 'day');
  };

  const isDateDisabled = disabledDates ? isDateInThePast : undefined;
  class Wrapper extends Component {
    state = {
      value: undefined,
    };

    handleChange = value => {
      this.setState({ value });
    };

    render() {
      const { value } = this.state;
      return (
        <Block>
          <T.Title>DateSelector with placeholder</T.Title>
          <Field inline columns={12} last>
            <DateSelector
              placeholder="Select a date"
              tz={'America/Los_Angeles'}
              selectedDate={value}
              min={min}
              max={max}
              modal={modal}
              horizontal={horizontal}
              isDateDisabled={isDateDisabled}
              onChange={this.handleChange}
              disabled={disabled}
            />
          </Field>
          <T.Text>The selected value will be shown here</T.Text>
          <Field>
            <pre>
              <code>{value ? value.format() : '--'}</code>
            </pre>
          </Field>
        </Block>
      );
    }
  }

  return Wrapper;
};

const SimpleDateSelector = getDateSelectorClass();
const DisabledDateSelector = getDateSelectorClass({ disabled: true });
const DateSelectorDisabledDates = getDateSelectorClass({ disabledDates: true });
const DateSelectorHorizontal = getDateSelectorClass({ horizontal: true });

const DateSelectorModal = getDateSelectorClass({ modal: true, horizontal: true });

const DateSelectorMinDate = getDateSelectorClass({
  min: now({ timezone: 'America/Los_Angeles' })
    .subtract(2, 'days')
    .startOf('day'),
});

const DateSelectorMaxDate = getDateSelectorClass({
  max: now({ timezone: 'America/Los_Angeles' })
    .add(3, 'days')
    .startOf('day'),
});

const DateSelectorMinMaxDate = getDateSelectorClass({
  min: now({ timezone: 'America/Los_Angeles' })
    .subtract(2, 'days')
    .startOf('day'),
  max: now({ timezone: 'America/Los_Angeles' })
    .add(3, 'days')
    .startOf('day'),
});

storiesOf('DateSelector', module)
  .add('DateSelector Simple', () => <SimpleDateSelector />, {
    propTables: [DateSelector],
  })
  .add('DateSelector disabled', () => <DisabledDateSelector />, {
    propTables: [DateSelector],
  })
  .add('DateSelector dates disabled', () => <DateSelectorDisabledDates />, {
    propTables: [DateSelector],
  })
  .add('DateSelector min', () => <DateSelectorMinDate />, {
    propTables: [DateSelector],
  })
  .add('DateSelector max', () => <DateSelectorMaxDate />, {
    propTables: [DateSelector],
  })
  .add('DateSelector min/max', () => <DateSelectorMinMaxDate />, {
    propTables: [DateSelector],
  })
  .add('DateSelector horizontal', () => <DateSelectorHorizontal />, {
    propTables: [DateSelector],
  })
  .add('DateSelector modal', () => <DateSelectorModal />);
