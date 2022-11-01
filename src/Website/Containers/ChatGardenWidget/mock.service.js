/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

import * as home from './mocks/01-home.json';
import * as collectAppointmentTime from './mocks/02-collectAppointmentTime.json';

// temp faker
export const createMockService = path => {
  if (path === 'CollectAppointmentTime') return collectAppointmentTime.default;
  return home.default;
};
