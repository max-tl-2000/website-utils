/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

/* eslint-disable react/prefer-stateless-function */
import React from 'react';
import { storiesOf } from '@storybook/react';
import svgs from '@redisrupt/red-svg-icons';
import Block from '../helpers/Block';
import { SvgIcon } from '../../src/components/SvgIcon/SvgIcon';
import styles from '../resources/SvgIcon.scss';

storiesOf('SvgIcon', module)
  .add('Social', () => (
    <Block>
      <SvgIcon name="social:facebook" />
      <SvgIcon name="social:twitter" />
      <SvgIcon name="social:instagram" />
      <SvgIcon name="social:google" />
    </Block>
  ))
  .add('Amenities', () => (
    <Block>
      {Object.keys(svgs.amenities).map(name => (
        <p>
          <SvgIcon key={name} name={`amenities:${name}`} />
        </p>
      ))}
    </Block>
  ))
  .add('Changing color of some icons', () => (
    <Block>
      <div className={styles.changeColor}>
        <SvgIcon name="social:facebook" />
        <SvgIcon name="social:twitter" />
        <SvgIcon name="social:instagram" />
        <SvgIcon name="social:google" />
      </div>
    </Block>
  ))
  .add('Changing size of some icons', () => (
    <Block>
      <div className={styles.changeSize}>
        <SvgIcon name="social:facebook" />
        <SvgIcon name="social:twitter" />
        <SvgIcon name="social:instagram" />
        <SvgIcon name="social:google" />
      </div>
    </Block>
  ));
