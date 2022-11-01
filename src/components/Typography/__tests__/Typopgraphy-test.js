/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

import React from 'react';

import { render, cleanup } from '@testing-library/react';
import * as T from '../Typopgraphy.js';

describe('Typography', () => {
  afterEach(cleanup);
  describe('Text', () => {
    it('should render a text element as a block', () => {
      const { container } = render(<T.Text>Some value to test</T.Text>);

      expect(container.firstChild).toMatchSnapshot();
    });

    it('should render a text element as inline using a span', () => {
      const { container } = render(<T.Text inline>Some value to test</T.Text>);

      // verify tag element is an span inside the snaphsot
      expect(container.firstChild).toMatchSnapshot();
    });
  });
});
