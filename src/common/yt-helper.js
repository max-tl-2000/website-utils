/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

import { deferred } from './deferred';
import { loadJS } from './loader';
let ytLoadPromise;

// inlined from https://www.npmjs.com/package/youtube-regex
const rgx = /(?:youtube\.com\/\S*(?:(?:\/e(?:mbed))?\/|watch\/?\?(?:\S*?&?v=))|youtu\.be\/)([a-zA-Z0-9_-]{6,11})/;

export const getVideoId = url => {
  const res = rgx.exec(url);
  return res[1];
};

export const isYoutubeUrl = url => rgx.test(url);

const _loadYTAPI = async () => {
  const dfd = deferred();

  window.onYouTubePlayerAPIReady = () => {
    dfd.resolve(window.YT);
    window.onYouTubePlayerAPIReady = null;
  };

  await loadJS('https://www.youtube.com/player_api');

  return dfd;
};

export const loadYTAPI = () => {
  if (!ytLoadPromise) {
    ytLoadPromise = _loadYTAPI();
  }

  return ytLoadPromise;
};
