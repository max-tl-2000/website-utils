/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

import React from 'react';
import { storiesOf } from '@storybook/react';
import IconButton from '../../src/components/IconButton/IconButton';
import SvgCopy from '../../src/resources/svgs/copy.svg';
import Block from '../helpers/Block';
import { SvgIcon } from '../../src/components/SvgIcon/SvgIcon';

storiesOf('IconButton', module)
  .add('default', () => (
    <Block>
      <IconButton icon={SvgCopy} label="copy" />
    </Block>
  ))
  .add('really long label', () => (
    <Block>
      <IconButton icon={SvgCopy} label="A really long text for a label" />
    </Block>
  ))
  .add('inverted', () => (
    <Block>
      <IconButton icon={SvgCopy} label="copy" iconOnLeft />
    </Block>
  ))
  .add('really long label inverted', () => (
    <Block>
      <IconButton icon={SvgCopy} label="A really long text for a label" iconOnLeft />
    </Block>
  ))
  .add('only icon', () => (
    <Block>
      <IconButton icon={SvgCopy} />
    </Block>
  ))

  .add('flat IconButton', () => (
    <Block>
      <IconButton type="flat" icon={SvgCopy} label="copy" />
    </Block>
  ))
  .add('flat, with really long label', () => (
    <Block>
      <IconButton type="flat" icon={SvgCopy} label="A really long text for a label" />
    </Block>
  ))
  .add('flat, inverted', () => (
    <Block>
      <IconButton type="flat" icon={SvgCopy} label="copy" iconOnLeft />
    </Block>
  ))
  .add('flat, really long label inverted', () => (
    <Block>
      <IconButton type="flat" icon={SvgCopy} label="A really long text for a label" iconOnLeft />
    </Block>
  ))
  .add('flat, only icon', () => (
    <Block>
      <IconButton type="flat" icon={SvgCopy} />
    </Block>
  ))
  .add('disabled', () => (
    <Block>
      <IconButton icon={SvgCopy} label="copy" disabled />
    </Block>
  ))
  .add('disabled flat', () => (
    <Block>
      <IconButton icon={SvgCopy} label="copy" disabled type="flat" />
    </Block>
  ))
  .add('IconButton secondary', () => (
    <Block>
      <IconButton icon={SvgCopy} label="copy" btnRole="secondary" />
    </Block>
  ))
  .add('flat IconButton secondary', () => (
    <Block>
      <IconButton type="flat" icon={SvgCopy} label="copy" btnRole="secondary" />
    </Block>
  ))
  .add('flat Icon with SvgIcon component', () => {
    const Ico = ({ className }) => <SvgIcon className={className} name="social:facebook" />;
    return (
      <Block>
        <IconButton type="flat" icon={Ico} />
      </Block>
    );
  });
