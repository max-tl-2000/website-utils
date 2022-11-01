/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

import { renderComponent } from '../common/render-helper';
import CarouselWidget from '../Website/Containers/CarouselWidget/CarouselWidget';

export const createCarouselWidget = (selector, props) => {
  renderComponent(CarouselWidget, { selector, props });
};
