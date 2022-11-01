/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

/* eslint-disable react/prefer-stateless-function */
import React, { Component } from 'react';
import { storiesOf } from '@storybook/react';

import { action } from '@storybook/addon-actions';
import Field from '../../src/components/Field/Field';
import Block from '../helpers/Block';
import Button from '../../src/components/Button/Button';
import * as T from '../../src/components/Typography/Typopgraphy';

class SimpleButton extends Component {
  render() {
    const { big } = this.props;
    return (
      <Block>
        <T.Title>Button stories</T.Title>
        <Field inline columns={12} last>
          <table>
            <tbody>
              <tr>
                <td colSpan="2">
                  <T.Text>FLAT BUTTONS</T.Text>
                </td>
                <td colSpan="2">
                  <T.Text>RAISED BUTTONS</T.Text>
                </td>
              </tr>
              <tr>
                <td>
                  <T.Text>Primary</T.Text>
                </td>
                <td>
                  <T.Text>Secondary</T.Text>
                </td>
                <td>
                  <T.Text>Primary</T.Text>
                </td>
                <td>
                  <T.Text>Secondary</T.Text>
                </td>
              </tr>
              <tr>
                <td>
                  <Button big={big} type="flat" label="NORMAL" />
                </td>
                <td>
                  <Button big={big} type="flat" label="NORMAL" btnRole="secondary" />
                </td>
                <td>
                  <Button big={big} type="raised" label="NORMAL" />
                </td>
                <td>
                  <Button big={big} type="raised" label="NORMAL" btnRole="secondary" />
                </td>
              </tr>
              <tr>
                <td>
                  <Button big={big} type="flat" label="focused" className="focused" />
                </td>
                <td>
                  <Button big={big} type="flat" label="focused" className="focused" btnRole="secondary" />
                </td>
                <td>
                  <Button big={big} type="raised" label="focused" className="focused" />
                </td>
                <td>
                  <Button big={big} type="raised" label="focused" className="focused" btnRole="secondary" />
                </td>
              </tr>
              <tr>
                <td>
                  <Button big={big} type="flat" label="hovered" className="hovered" />
                </td>
                <td>
                  <Button big={big} type="flat" label="hovered" className="hovered" btnRole="secondary" />
                </td>
                <td>
                  <Button big={big} type="raised" label="hovered" className="hovered" />
                </td>
                <td>
                  <Button big={big} type="raised" label="hovered" className="hovered" btnRole="secondary" />
                </td>
              </tr>
              <tr>
                <td>
                  <Button big={big} type="flat" label="pressed" className="pressed" />
                </td>
                <td>
                  <Button big={big} type="flat" label="pressed" className="pressed" btnRole="secondary" />
                </td>
                <td>
                  <Button big={big} type="raised" label="pressed" className="pressed" />
                </td>
                <td>
                  <Button big={big} type="raised" label="pressed" className="pressed" btnRole="secondary" />
                </td>
              </tr>
              <tr>
                <td>
                  <Button big={big} type="flat" label="disabled" disabled />
                </td>
                <td>
                  <Button big={big} type="flat" label="disabled" btnRole="secondary" disabled />
                </td>
                <td>
                  <Button big={big} type="raised" label="disabled" disabled />
                </td>
                <td>
                  <Button big={big} type="raised" label="disabled" btnRole="secondary" disabled />
                </td>
              </tr>
            </tbody>
          </table>
        </Field>
      </Block>
    );
  }
}

storiesOf('Button', module)
  .add('Flat - Loading state', () => (
    <Block>
      <Button type="flat" label="some button" loading />
    </Block>
  ))
  .add('Raised - Loading state', () => (
    <Block>
      <Button type="raised" label="some button" loading />
    </Block>
  ))
  .add('Flat button', () => (
    <Block>
      <Button type="flat" label="I'm a FLAT button" />
    </Block>
  ))
  .add('Raised button', () => (
    <Block>
      <Button type="raised" label="I'm a RAISED button" />
    </Block>
  ))
  .add('Flat button disabled', () => (
    <Block>
      <Button type="flat" label="I'm a FLAT button" disabled />
    </Block>
  ))
  .add('Raised button disabled', () => (
    <Block>
      <Button type="raised" label="I'm a RAISED button" disabled />
    </Block>
  ))
  .add('Flat Button Roles', () => (
    <Block>
      <Button type="flat" btnRole="secondary" label="Secondary Action" />
      <Button type="flat" btnRole="primary" label="Primary Action" />
    </Block>
  ))
  .add('Raised Button Roles', () => (
    <Block>
      <Button type="raised" btnRole="secondary" label="Secondary Action" />
      <Button type="raised" style={{ marginLeft: 10 }} btnRole="primary" label="Primary Action" />
    </Block>
  ))
  .add('Flat button big', () => (
    <Block>
      <Button big type="flat" label="I'm a FLAT button" />
    </Block>
  ))
  .add('Raised button big', () => (
    <Block>
      <Button big type="raised" label="I'm a RAISED button" />
    </Block>
  ))
  .add('Flat button disabled big', () => (
    <Block>
      <Button big type="flat" label="I'm a FLAT button" disabled />
    </Block>
  ))
  .add('Raised button disabled big', () => (
    <Block>
      <Button big type="raised" label="I'm a RAISED button" disabled />
    </Block>
  ))
  .add('Flat Button Roles big', () => (
    <Block>
      <Button big type="flat" btnRole="secondary" label="Secondary Action" />
      <Button big type="flat" btnRole="primary" label="Primary Action" />
    </Block>
  ))
  .add('Raised Button Roles big', () => (
    <Block>
      <Button big type="raised" btnRole="secondary" label="Secondary Action" />
      <Button big type="raised" style={{ marginLeft: 10 }} btnRole="primary" label="Primary Action" />
    </Block>
  ))
  .add('Handling events', () => (
    <Block>
      <Button big type="raised" btnRole="secondary" label="Click me!" onClick={() => action('click on button')()} />
      <Button big type="raised" style={{ marginLeft: 10 }} btnRole="primary" label="Or click me" onClick={() => action('click on button')()} />
    </Block>
  ))
  .add('Themable with css variables', () => (
    <Block>
      <div
        style={{
          '--reva-global-accent-color': '#598381',
          '--reva-global-accent-color-hovered': '#6D9C9A',
          '--reva-global-accent-color-pressed': '#63928F',
          display: 'grid',
          columnGap: '.5rem',
          gridTemplateColumns: 'repeat(6, 1fr)',
        }}>
        <Button type="raised" btnRole="primary" label="I am primary styled using css vars" />
        <Button type="raised" btnRole="primary" label="I am secondary styled using css vars" />
        <Button type="flat" btnRole="primary" label="I am flat styled using css vars" />
        <Button type="outline" label="I am outline styled using css vars" />
      </div>
    </Block>
  ))
  .add('All states', () => <SimpleButton />)
  .add('All states big', () => <SimpleButton big />);
