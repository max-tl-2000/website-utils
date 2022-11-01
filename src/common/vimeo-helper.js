/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

import { deferred } from './deferred';
import { loadJS } from './loader';
let vimeoLoadPromise;

// inlined from https://www.npmjs.com/package/vimeo-regex
const rgx = /(http|https)?:\/\/(www\.)?vimeo.com\/(?:channels\/(?:\w+\/)?|groups\/([^/]*)\/videos\/|)(\d+)(?:|\/\?)/;

export const getVideoId = url => {
  const res = rgx.exec(url) || [];
  return res[4];
};

export const isVimeoUrl = url => rgx.test(url);

const _loadVimeoAPI = async () => {
  const dfd = deferred();

  await loadJS('https://player.vimeo.com/api/player.js');
  dfd.resolve(window.Vimeo);
  return dfd;
};

export const loadVimeoAPI = () => {
  if (!vimeoLoadPromise) {
    vimeoLoadPromise = _loadVimeoAPI();
  }

  return vimeoLoadPromise;
};
