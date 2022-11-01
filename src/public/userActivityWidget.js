/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

import { renderComponent } from '../common/render-helper';
import { getWebSiteStore } from '../Website/Stores/WebSiteStore';
import UserActivityAttestation, { createUserActivityContainer } from '../Website/Containers/UserActivity/UserActivityAttestation';

export const createUserActivityWidget = () => {
  const webSiteStore = getWebSiteStore();
  renderComponent(UserActivityAttestation, { selector: createUserActivityContainer(), stores: { webSiteStore } });
};
