/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

import { location } from '../../common/globals';

export const navigateTo = url => {
  location.href = url;
};

export const navigateToProperty = ({ propertyId } = {}) => {
  if (!propertyId) throw new Error('PropertyId is required');
  navigateTo(`/property/${propertyId}`);
};

export const navigateToSearch = (/* params */) => {
  // todo handle here the param changes (probably will have to be done) using the
  // hash of the url or use the history module to modify the url without reloading
  // https://www.npmjs.com/package/history

  navigateTo('/communities');
};
