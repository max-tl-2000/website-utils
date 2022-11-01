/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

export const Events = {
  SEARCH_BOX_RESULT_CLICK: 'searchBoxResultClick',
  SEARCH_BOX_CLEAR: 'searchBoxClear',
  SEARCH_FILTERS_CHANGE: 'searchFiltersChange',
  PROPERTY_CARD_CLICK: 'propertyCardClick',
  MAP_MARKER_CLICK: 'mapMarkerClick',
  LAYOUT_GROUP_SELECTED: 'layoutGroupSelected',
  PHONE_BUTTON_CLICK: 'phoneButtonClick',
  MOVE_IN_DATE_SET: 'moveInDateSet',
  INVENTORY_CLICK: 'inventoryClick',
  NAVIGATION_LINK_CLICK: 'navigationLinkClick',
  MAP_PROPERTY_CARD_CLICK: 'mapPropertyCardClick',
  PERSONALIZED_PRICE_BUTTON_CLICK: 'personalizedPriceButtonClick',
  SCHEDULE_TOUR_BUTTON_CLICK: 'scheduleTourButtonClick',
  CLOSE_DIALOG: 'closeDialog',
  PROPERTY_LOADED: 'propertyLoaded',
  WEB_INQUIRY: 'webInquiry',
  MARKET_SECTIONS_OVERLAY_STATE_CHANGE: 'marketsSectionOverlayStateChange',
  WEBCHAT_OPEN: 'webchatOpen',
  WEBCHAT_CLOSE: 'webchatClose',
};

export const Categories = {
  NAVIGATION: 'navigation',
  USER_ACTION: 'userAction',
  SALES: 'Sales',
  SEARCH: 'Search',
  SYSTEM_ACTION: 'systemAction',
  NAVIGATION_WEBCHAT: 'navigation_webchat',
  USER_ACTION_WEBCHAT: 'userAction_webchat',
};

export const Components = {
  SEARCH_BOX: 'searchBox',
  SEARCH_FILTERS: 'searchFilters',
  MAP: 'map',
  APPOINTMENT_CREATE: 'appointmentCreate',
  PROPERTY_CARD_GRID: 'propertyCardGrid',
  PHONE_BUTTON: 'phoneButton',
  INVENTORY_SELECTOR: 'inventorySelector',
  INVENTORY_UNIT: 'inventoryUnit',
  NAVIGATION: 'navigation',
  OVERLAYS: 'overlays',
  INVENTORY_DIALOG: 'inventoryDialog',
  STORES: 'stores',
  CONTACT_US_DIALOG: 'contactUsDialog',
  CONTACT_US: 'contactUs',
  GENERATE_QUOTE: 'generateQuote',
};

export const SubContexts = {
  SEARCH_FILTERS: 'searchFilters',
  MAP: 'map',
  PROPERTY_DETAILS_HEADER: 'propertyDetailsHeader',
  INVENTORY_UNIT: 'inventoryUnit',
  MOVE_IN_DATE: 'moveInDate',
  HOME_HERO_BLOCK: 'homeHeroBlock',
  PERSONALIZED_PRICE: 'personalizedPrice',
  BOOK_APPOINTMENT: 'bookAppointment',
  WEBCHAT: 'webchat',
};

export const isValidEvent = event => event && !!Object.values(Events).find(e => e === event);
