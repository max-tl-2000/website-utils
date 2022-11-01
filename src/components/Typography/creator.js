/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

import { createElement } from 'react';
import classnames from 'classnames/bind';
import styles from './Typography.scss';

import { isString } from '../../common/type-of';
import { isValidChildrenProp } from '../../common/validate-content';
import nullish from '../../common/nullish';

const cx = classnames.bind(styles);

export const createTextElement = displayName => {
  const Element = props => {
    const {
      className,
      breakAll,
      breakWord,
      primary = true,
      secondary,
      lighterForeground,
      uppercase,
      raw,
      justify,
      noMargin,
      bold,
      ellipsis,
      highlight,
      error,
      disabled,
      italic,
      inline,
      underline,
      clickable,
      clampLines,
      ...restProps
    } = props;

    const shouldClamp = !nullish(clampLines);

    // eslint-disable-next-line prefer-const
    let { children, ...rest } = restProps;

    const theProps = {
      'data-text-element': true,
      'data-component': displayName,
      className: cx(
        'textElement',
        displayName,
        {
          primary,
          secondary,
          underline,
          bold,
          highlight,
          ellipsis,
          error,
          breakWord,
          breakAll,
          disabled,
          uppercase,
          clickable,
          italic,
          justify,
          clampLines: shouldClamp,
          lighterForeground,
          noRaw: !raw,
          raw,
          noMargin,
        },
        className,
      ),
      ...rest,
    };

    if (ellipsis && isString(children)) {
      theProps.title = children;
    }

    const tagElement = inline ? 'span' : 'p';
    // some elements report typeof 'object' but are in reality arrays
    if (!isValidChildrenProp(children)) {
      console.error('Invalid children found', displayName, children);
      children = ''; // just handle it as an empty text
    }

    if (shouldClamp) {
      theProps.style = {
        ...theProps.style,
        WebkitLineClamp: clampLines,
      };
    }

    return createElement(displayName === 'Link' ? 'a' : tagElement, theProps, children);
  };

  Element.displayName = displayName;

  return Element;
};
