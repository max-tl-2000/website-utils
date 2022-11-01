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
import * as T from '../../src/components/Typography/Typopgraphy';
import SizeAware from '../../src/components/SizeAware/SizeAware';
import { ResizableContainer } from '../helpers/ResizableHelper';

class SizeAwareNoBreakpoints extends Component {
  state = {};

  handleSizeChange = ({ width }) => {
    this.setState({ width });
  };

  render() {
    const { width } = this.state;
    return (
      <Block>
        <ResizableContainer width={400} height={400}>
          <SizeAware
            style={{ background: '#eee', boxShadow: '0 0 10px 5px rgba(0,0,0,.2)', height: '100%', width: '100%', padding: 32 }}
            onSizeChange={this.handleSizeChange}>
            <T.Caption>Current box width: {width}</T.Caption>
          </SizeAware>
        </ResizableContainer>
      </Block>
    );
  }
}

class SizeAwareBrekapoints extends Component {
  state = {};

  handleBreakpointChange = ({ breakpoint }) => {
    this.setState({ breakpoint });
  };

  breakpoints = { small: [0, 400], medium: [401, 800], large: [801, Infinity] };

  render() {
    const { breakpoint } = this.state;
    return (
      <Block>
        <ResizableContainer width={400} height={400}>
          <SizeAware
            breakpoints={this.breakpoints}
            style={{ background: '#eee', boxShadow: '0 0 10px 5px rgba(0,0,0,.2)', height: '100%', width: '100%', padding: 32 }}
            onBreakpointChange={this.handleBreakpointChange}>
            <T.Caption>Current box breakpoint: {breakpoint}</T.Caption>
          </SizeAware>
        </ResizableContainer>
      </Block>
    );
  }
}

class SizeAwareBrekapointsFn extends Component {
  breakpoints = { small: [0, 400], medium: [401, 800], large: [801, Infinity] };

  render() {
    return (
      <Block>
        <ResizableContainer width={600} height={400}>
          <SizeAware
            breakpoints={this.breakpoints}
            style={{ background: '#eee', boxShadow: '0 0 10px 5px rgba(0,0,0,.2)', height: '100%', width: '100%', padding: 32 }}>
            {({ breakpoint }) => (
              <>
                <T.Caption>Current box breakpoint: {breakpoint}</T.Caption>
              </>
            )}
          </SizeAware>
        </ResizableContainer>
      </Block>
    );
  }
}

class SizeAwareBrekapointsAsArray extends Component {
  breakpoints = [{ xsmall1: 0 }, { xsmall2: 481 }, { small1: 601 }, { small2: 841 }, { medium: 961 }, { large: 1265 }, { xlarge: 1905 }];

  render() {
    return (
      <Block>
        <T.Title>Responsive design using the SizeAware</T.Title>
        <T.Text>This is super useful to implement responsive layouts using the classnames helper. Check the Footer navigation source code</T.Text>
        <pre style={{ border: '1px solid #aaa', padding: '10px 20px', background: '#eee' }}>
          <code>
            {`
<SizeAware
  breakpoints={this.breakpoints}
  style={{ background: '#eee', boxShadow: '0 0 10px 5px rgba(0,0,0,.2)', height: '100%', width: '100%', padding: 32 }}>
  {({ breakpoint, matches }) => <div className={cx('someClass', matches)}> ... </div> }
</SizeAware>`.trim()}
          </code>
        </pre>
        <ResizableContainer width={600} height={400}>
          <SizeAware
            breakpoints={this.breakpoints}
            style={{ background: '#eee', boxShadow: '0 0 10px 5px rgba(0,0,0,.2)', height: '100%', width: '100%', padding: 32 }}>
            {({ breakpoint, matches }) => (
              <>
                <T.Title>Current box breakpoint: {breakpoint}</T.Title>
                <pre>
                  <code>{JSON.stringify(matches, null, 2)}</code>
                </pre>
              </>
            )}
          </SizeAware>
        </ResizableContainer>
      </Block>
    );
  }
}

storiesOf('SizeAware', module)
  .add('width changes', () => <SizeAwareNoBreakpoints />)
  .add('breakpoint changes', () => <SizeAwareBrekapoints />)
  .add('breakpoint changes render child as fn', () => <SizeAwareBrekapointsFn />)
  .add('breakpoints as array', () => <SizeAwareBrekapointsAsArray />);
