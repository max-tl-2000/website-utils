/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

import { trans } from '../../../../common/trans';

export const getFailedToLoadUnitError = () =>
  trans(
    'PERSONALIZED_PRICE_ERROR_MESSAGE',
    'Our availability changes frequently and this unit is no longer available. Please go back to the property page and select a different unit.',
  );
