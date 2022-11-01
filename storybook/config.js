/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

/* eslint-disable global-require */
import { configure } from '@storybook/react';

require('./helpers/font-loader.scss');

function loadStories() {
  require('./stories/Button');
  require('./stories/TextBox');
  require('./stories/Typopgraphy');
  require('./stories/Wizard');

  require('./stories/NavigationWidget');
  require('./stories/SearchFilterWidget');
  require('./stories/PropertyCard');
  require('./stories/PropertyCardGrid');
  require('./stories/RelatedPropertyList');
  require('./stories/Picture');
  require('./stories/SearchResultListWidget');
  require('./stories/IconButton');
  require('./stories/Carousel');
  require('./stories/Dialogs');
  require('./stories/InventorySelector');
  require('./stories/ShareLinkDialogWidget');
  require('./stories/Question');
  require('./stories/Map');
  require('./stories/PageErrorWidget');
  require('./stories/FilterableList');
  require('./stories/DateSelector');
  require('./stories/SizeAware');
  require('./stories/ContactUsForm');
  require('./stories/SearchFilterLoadingPlaceholder');
  require('./stories/SvgIcon');
  require('./stories/Dropdown');
}

configure(loadStories, module);
