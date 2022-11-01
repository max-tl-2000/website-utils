/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

import { render } from '@testing-library/react';
import React from 'react';
import userEvent from '@testing-library/user-event';
import QueryFilter from '../QueryFilter';
import { properties } from './fixtures/properties';

describe('QueryFilter', () => {
  it('should render without throwing an error', () => {
    const { container } = render(<QueryFilter />);
    const { firstChild } = container;

    // check the snapshot to verify it is rendering the correct markup
    expect(firstChild).toMatchSnapshot();
  });

  describe('when user types something in the input', () => {
    it('should show matching results to the partial text typed in the input', () => {
      const { container } = render(<QueryFilter properties={properties} />);
      const { firstChild } = container;

      const input = firstChild.querySelector('input');

      userEvent.type(input, 'Alps P');

      // check the snapshot to verify it is rendering the correct markup
      expect(firstChild).toMatchSnapshot();
    });

    it('should show matching properties even when the text contain blank spaces before and after the partial text', () => {
      const { container } = render(<QueryFilter properties={properties} />);
      const { firstChild } = container;

      const input = firstChild.querySelector('input');

      userEvent.type(input, '   Alps P   ');

      // check the snapshot to verify it is rendering the correct markup
      expect(firstChild).toMatchSnapshot();
    });

    describe('when the partial text typed does not match any property', () => {
      it('should show a message informing that no matching properties were found', () => {
        const { container } = render(<QueryFilter properties={properties} />);
        const { firstChild } = container;

        const input = firstChild.querySelector('input');

        userEvent.type(input, '   NotFound   ');

        // check the snapshot to verify it is rendering the correct markup
        expect(firstChild).toMatchSnapshot();
      });
    });
  });
});
