/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

import React from 'react';
import { hydrateComponents } from '../common/interpolationHelper';
import { document } from '../common/globals';
import { qs } from '../common/dom';
import { renderComponent } from '../common/render-helper';
import Button from '../components/Button/Button';
import { navigateTo } from '../Website/helpers/navigator';

const components = {
  button: ({ ele, markupData }) =>
    renderComponent(
      () => {
        const props = {};
        const { linkTo, w, ...rest } = markupData;
        if (linkTo) {
          props.onClick = () => {
            navigateTo(linkTo);
          };
        }
        return <Button {...rest} {...props} />;
      },
      { selector: ele },
    ),
};

export const hydrateComponentsFromMarkup = selector => {
  const ele = qs(selector) || document.body;

  hydrateComponents({ ele, keyAttribute: 'data-w', components });
};
