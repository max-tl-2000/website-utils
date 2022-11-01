/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

import React from 'react';
import { renderComponent } from '../common/render-helper';
import { YoutubeBgVideo } from '../components/BackgroundVideo/YoutubeBgVideo';
import { VimeoBgVideo } from '../components/BackgroundVideo/VimeoBgVideo';
import { isYoutubeUrl } from '../common/yt-helper';
import { isVimeoUrl } from '../common/vimeo-helper';

export const createBackgroundVideo = (selector, props = {}) => {
  const { src } = props;

  if (!src) throw new Error('Video src is required');

  renderComponent(
    () => {
      if (isYoutubeUrl(src)) {
        return <YoutubeBgVideo src={props.src} fallback={props.fallback} />;
      }

      if (isVimeoUrl(src)) {
        return <VimeoBgVideo src={props.src} fallback={props.fallback} />;
      }

      throw new Error('background video not supported. Please use a vimeo or youtube video url');
    },
    { selector },
  );
};
