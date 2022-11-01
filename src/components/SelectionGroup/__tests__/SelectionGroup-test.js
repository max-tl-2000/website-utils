/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

import React from 'react';

import { render, fireEvent, cleanup } from '@testing-library/react';
import SelectionGroup from '../SelectionGroup';

describe('SelectionGroup', () => {
  afterEach(cleanup);
  const lifestyles = [
    {
      displayName: '24 hour gym',
      infographicName: 'gym',
    },
    {
      displayName: 'Active night life',
      infographicName: 'night-life',
    },
    {
      displayName: 'Bike friendly',
      infographicName: 'bike-friendly',
    },
    {
      displayName: 'Close to city center',
      infographicName: 'city-center',
    },
  ];

  describe('when SelectionGroup supports multiple selections', () => {
    it('should render elements and select gym', () => {
      const { container } = render(<SelectionGroup items={lifestyles} multiple textField="displayName" valueField="infographicName" />);
      const gymEle = container.querySelector('[data-value="gym"]');
      expect(gymEle.getAttribute('data-checked')).toBe('false');
      fireEvent.click(gymEle);
      expect(gymEle.getAttribute('data-checked')).toBe('true');
      expect(container.firstChild.childElementCount).toBe(lifestyles.length);
    });

    it('should render elements and select gym and night-life', () => {
      const { container } = render(<SelectionGroup items={lifestyles} multiple textField="displayName" valueField="infographicName" />);
      const gymEle = container.querySelector('[data-value="gym"]');
      const nightLifeEle = container.querySelector('[data-value="night-life"]');

      expect(gymEle.getAttribute('data-checked')).toBe('false');
      expect(nightLifeEle.getAttribute('data-checked')).toBe('false');

      fireEvent.click(gymEle);
      fireEvent.click(nightLifeEle);

      expect(gymEle.getAttribute('data-checked')).toBe('true');
      expect(nightLifeEle.getAttribute('data-checked')).toBe('true');
      expect(container.firstChild.childElementCount).toBe(lifestyles.length);
    });
  });

  describe('when SelectionGroup does not support multiple selections', () => {
    it('should render elements and select only night-life', () => {
      const { container } = render(<SelectionGroup items={lifestyles} textField="displayName" valueField="infographicName" />);
      const gymEle = container.querySelector('[data-value="gym"]');
      const nightLifeEle = container.querySelector('[data-value="night-life"]');

      expect(gymEle.getAttribute('data-checked')).toBe('false');
      expect(nightLifeEle.getAttribute('data-checked')).toBe('false');

      fireEvent.click(gymEle);
      fireEvent.click(nightLifeEle);

      expect(gymEle.getAttribute('data-checked')).toBe('false');
      expect(nightLifeEle.getAttribute('data-checked')).toBe('true');
      expect(container.firstChild.childElementCount).toBe(lifestyles.length);
    });
  });

  describe('when SelectionGroup has pre selected items', () => {
    it('should render elements and select gym and night-life', () => {
      const { container } = render(<SelectionGroup items={lifestyles} multiple textField="displayName" valueField="infographicName" value={['gym']} />);
      const gymEle = container.querySelector('[data-value="gym"]');
      const nightLifeEle = container.querySelector('[data-value="night-life"]');

      expect(gymEle.getAttribute('data-checked')).toBe('true');
      expect(nightLifeEle.getAttribute('data-checked')).toBe('false');

      fireEvent.click(nightLifeEle);

      expect(gymEle.getAttribute('data-checked')).toBe('true');
      expect(nightLifeEle.getAttribute('data-checked')).toBe('true');
      expect(container.firstChild.childElementCount).toBe(lifestyles.length);
    });
  });
});
