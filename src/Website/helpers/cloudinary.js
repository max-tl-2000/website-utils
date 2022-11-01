/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

import trim from 'jq-trim';
import { getDevicePixelRatio } from './screen';
import { combineWithParams } from '../../common/serialize';

const settings = {
  cloudName: 'revat',
  url: 'https://res.cloudinary.com',
};

const getUrlParameters = options => (options && options.length > 0 ? `${options.filter(opt => !!opt).join(',')}/` : '');

const isCloudinaryUrl = (url = '') => trim(url).startsWith(settings.url);

const buildCloudinaryUrl = (imageNameOrUrl, { imageFolder, buildParameters }) => {
  if (isCloudinaryUrl(imageNameOrUrl)) return imageNameOrUrl;
  if (!imageNameOrUrl) return ''; // if not imageNameOrUrl, just return an empty string

  if (imageNameOrUrl.includes('reva.tech/api/images')) {
    const qParams = { cParams: buildParameters() };

    return combineWithParams(imageNameOrUrl, qParams);
  }

  if (settings.cloudName) return `${settings.url}/${settings.cloudName}/image/${imageFolder}/${buildParameters()}${encodeURIComponent(imageNameOrUrl)}`;

  // In case of error, jsut return the url. Error('cloudinary cloudName not set');
  return imageNameOrUrl;
};

export const getUrlFromCloudinary = (imageUrl, params = {}) => {
  const { cloudinaryParams = [], maxDPR } = params;

  const dprOption = `dpr_${getDevicePixelRatio(maxDPR)}.0`;
  return buildCloudinaryUrl(imageUrl, { imageFolder: 'fetch', buildParameters: () => getUrlParameters([dprOption, ...cloudinaryParams]) });
};
