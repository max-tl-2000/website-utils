/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

import React from 'react';
import { Provider } from 'mobx-react';
import { render, unmountComponentAtNode } from 'react-dom';

import { qs } from './dom';

export const renderComponent = (Component, { selector, stores, props } = {}) => {
  if (!selector) throw new Error('Selector is required');
  if (!Component) throw new Error('Component is required ');

  const element = typeof selector === 'string' ? qs(selector) : selector;

  if (element.setAttribute) {
    element.setAttribute('data-reva-root', true);
  }

  render(
    <Provider {...stores}>
      <Component {...props} />
    </Provider>,
    element,
  );

  const dispose = () => {
    unmountComponentAtNode(element);
  };

  return dispose;
};
