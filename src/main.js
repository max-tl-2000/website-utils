/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

import { configure } from 'mobx';
import debounce from 'debouncy';
import 'core-js';

import { setCurrentModulePath } from './common/currentResource';

import { initBookAppointmentWidget } from './public/bookAppointmentWidget';
import { showFormDialogWidget } from './public/formDialogWidget';
import { createSearchMapWidget, createPropertyMapWidget } from './public/mapWidget';
import { createNavigationWidget } from './public/navigationWidget';

import * as dom from './common/dom';
import { createRelatedPropertiesWidget } from './public/relatedPropertiesWidget';
import { createLifeStylesWidget } from './public/lifeStylesWidget';
import { createSearchFiltersWidget } from './public/searchFilterWidget';
import { createSearchResultListWidget } from './public/searchResultListWidget';
import { createQueryFilterWidget } from './public/queryFilterWidget';
import { createInventorySelectorWidget } from './public/inventorySelectorWidget';
import { createChatGardenWidget } from './public/createChatGardenWidget';
import { createShareLinkDialogWidget } from './public/shareLinkDialogWidget';
import { getWebSiteStore } from './Website/Stores/WebSiteStore';
import { createContactUsWidget } from './public/contactUsWidget';
import { initUtils } from './public/init';
import * as navigator from './Website/helpers/navigator';
import { createSearchBoxWidget } from './public/searchBoxWidget';
import { createSearchBoxFilterWidget } from './public/searchBoxFilterWidget';
import { getWebSiteService } from './Services/WebSiteService';
import { createBookerWidget } from './public/bookerWidget';
import { createCarouselWidget } from './public/carouselWidget';
import { createUserActivityWidget } from './public/userActivityWidget';
import { createPropertySpecialsWidget } from './public/propertySpecialsWidget';
import { createPropertyLogoWidget } from './public/propertyLogoWidget';
import { createSearchInfoWidget } from './public/searchInfoWidget';

import { createPageErrorWidget } from './public/pageErrorWidget';
import { createPropertyInfoWidget } from './public/propertyInfoWidget';
import { createPropertyRichTextResultsWidget } from './public/propertyRichTextResultsWidget';
import { createMenuOverlay } from './public/createMenuOverlay';
import { createSimpleContactUsDialog } from './public/createSimpleContactUsDialog';
import { createSimpleCustomerConcernDialog } from './public/createSimpleCustomerConcernDialog';
import { createContactUsForm, createContactDialog } from './public/createContactUsForm';

import './Website/helpers/focusFix';
import { combineWithParams } from './common/serialize';
import { createPropertyTabs } from './public/createPropertyTabs';
import { defineProperty, objectSpread } from './common/babel-utils';
import { getScrollingElement } from './common/scrolling-element';
import * as tracking from './Website/helpers/tracking-helper';
import * as imageHelper from './Website/helpers/images';
import { scrollToElement } from './common/scrollToElement';
import { createBackgroundVideo } from './public/createBackgroundVideo';
import { replaceMarkupInDOM } from './public/revaReplacer';
import { reloadStyles } from './common/reloadStyles';
import { registerTrans } from './common/trans';
import { createResidentWidget } from './public/residentLauncher';
import { createScheduleTourWidget } from './public/scheduleTourWidget';

const scripts = document.getElementsByTagName('SCRIPT');
const currentJSFile = scripts[scripts.length - 1].src;

setCurrentModulePath(currentJSFile);

// make sure mobx mutations can only happen inside actions
configure({ enforceActions: 'observed', isolateGlobalState: true });

// this creates or reuses the global variable Reva where our global utilities will be exported
const Reva = (window.Reva = window.Reva || {});

const ui = {
  initBookAppointmentWidget,
  showFormDialogWidget,
  createSearchMapWidget,
  createPropertyMapWidget,
  createRelatedPropertiesWidget,
  createNavigationWidget,
  createLifeStylesWidget,
  createSearchFiltersWidget,
  createSearchResultListWidget,
  createQueryFilterWidget,
  createInventorySelectorWidget,
  createChatGardenWidget,
  createSearchBoxWidget,
  createSearchBoxFilterWidget,
  createShareLinkDialogWidget,
  createBookerWidget,
  createCarouselWidget,
  createPageErrorWidget,
  createPropertyInfoWidget,
  createContactUsWidget,
  createMenuOverlay,
  createPropertyTabs,
  createUserActivityWidget,
  createPropertySpecialsWidget,
  createPropertyLogoWidget,
  createSimpleContactUsDialog,
  createBackgroundVideo,
  createSimpleCustomerConcernDialog,
  createContactUsForm,
  createContactDialog,
  replaceMarkupInDOM,
  createSearchInfoWidget,
  createPropertyRichTextResultsWidget,
  createResidentWidget,
  createScheduleTourWidget,
};

const stores = {
  getWebSiteStore,
};

Reva.services = {
  getWebSiteService,
};

Reva.utils = {
  scrollToElement,
  debounce,
  combineWithParams,
  defineProperty,
  objectSpread,
  getScrollingElement,
  imageHelper,
  reloadStyles,
  registerTrans,
};

Reva.tracking = tracking;

Reva.dom = dom;
Reva.initUtils = initUtils;

Reva.ui = ui;
Reva.stores = stores;
Reva.navigator = navigator;

// [Deprecated] global functions used to be exported directly to the global scope
// but to avoid conflicts in the future and for better organization we should only export
// functions and objects using the single window.__reva__ global

window.__initBookAppointment = initBookAppointmentWidget;
window.__showFormDialog = showFormDialogWidget;
