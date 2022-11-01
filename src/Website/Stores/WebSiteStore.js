/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

import { computed, observable, action, reaction } from 'mobx';
import { create } from 'lru2';
import sortBy from 'lodash/sortBy';
import sortedIndexBy from 'lodash/sortedIndexBy';

import { getWebSiteService, getSelfServeService } from '../../Services/WebSiteService';
import PropertyStore from './PropertyStore';
import SearchStore from './SearchStore';
import { parseUrl } from '../../common/parseUrl';
import InventoryStore from './InventoryStore';
import { now } from '../../common/moment-utils';
import { YEAR_MONTH_DAY_FORMAT } from '../helpers/dateConstants';
import { getScreenSizeStore } from './ScreenSizeStore';
import PropertyTabsStore from './PropertyTabsStore';
import GenericMessageFormStore from './GenericMessageFormStore';

import { Tracker } from '../helpers/tracker';
import { appState } from './AppState';
import { withCachedPromise } from '../../common/with-cached-promise';
import { createCacheableRequestForWebsiteUtils } from '../helpers/cacheableRequestHelper';
import { Events, Categories, Components } from '../helpers/tracking-helper';

const propertyCache = create({ limit: 5 });
const inventoryCache = create({
  limit: 6,
  onRemoveEntry: entry => {
    entry.destroy();
  },
});

const parseApiHostURL = url => {
  const parsed = parseUrl(url);
  const hostname = parsed?.hostname;

  const [tenantName, ...rest] = hostname.split(/\./g);

  return {
    tenantName,
    domain: rest.join('.'),
  };
};

class WebSiteStore {
  @computed
  get loading() {
    return this.propertiesRq.loading;
  }

  @computed
  get loaded() {
    return this.propertiesRq.success;
  }

  @observable
  _fullName;

  @computed
  get fullName() {
    return this._fullName;
  }

  @action
  setFullName(value) {
    this._fullName = value;
  }

  @observable
  _phoneNo;

  @computed
  get phoneNo() {
    return this._phoneNo;
  }

  @action
  setPhoneNo(value) {
    this._phoneNo = value;
  }

  @observable
  _trackUserActivityEnabled;

  @computed
  get trackUserActivityEnabled() {
    return this._trackUserActivityEnabled;
  }

  @action
  enableTrackUserActivity(value) {
    if (this.trackUserActivityEnabled === value) return;

    this._trackUserActivityEnabled = value;
    appState.trackUserActivity = value;
  }

  @observable
  _email;

  @computed
  get email() {
    return this._email;
  }

  @action
  setEmail(value) {
    this._email = value;
  }

  @observable
  _moveInDate;

  @computed
  get nowAtProperty() {
    return this.minMoveInDate;
  }

  @computed
  get minMoveInDate() {
    const { timezone } = this.currentPropertyStore || {};
    if (!timezone) return null;
    return now({ timezone }).startOf('day');
  }

  @computed
  get minMoveInDateFormatted() {
    const { minMoveInDate } = this;
    if (!minMoveInDate) return '';
    return minMoveInDate.format(YEAR_MONTH_DAY_FORMAT);
  }

  @computed
  get moveInDate() {
    const { _moveInDate } = this;
    const moveInDate = _moveInDate || this.minMoveInDate;
    if (!moveInDate) return '';

    return moveInDate;
  }

  @action
  setMoveInDate(value) {
    const { minMoveInDate, _moveInDate } = this;
    const date = value || minMoveInDate;
    if (_moveInDate && _moveInDate.isSame(date)) return;
    this._moveInDate = date.isSameOrBefore(minMoveInDate) ? minMoveInDate : date;
  }

  @observable
  _moveInTime;

  @computed
  get moveInTime() {
    return this._moveInTime;
  }

  @action
  setMoveInTime(value) {
    this._moveInTime = value;
  }

  getChildPropertyLocationInfo = (property, columnValue) => {
    switch (true) {
      case !!property[columnValue]:
        return { childName: property[columnValue], locationSelector: columnValue };
      case !!property.city:
        return { childName: property.city, locationSelector: 'city' };
      case !!property.neighborhood:
        return { childName: property.neighborhood, locationSelector: 'neighborhood' };
      default:
        return { childName: property.region, locationSelector: 'region' };
    }
  };

  groupPropertiesByFilter = (properties = [], filter) => {
    const { columnTitle, columnValue } = filter;
    const propertiesMap = new Map();

    const getGroup = property => {
      let group = propertiesMap.get(property[columnTitle]);
      if (!group) {
        group = { name: property[columnTitle], children: [], id: property[columnTitle] };
        propertiesMap.set(property[columnTitle], group);
      }

      return group;
    };

    properties.forEach(property => {
      const group = getGroup(property);
      const { childName, locationSelector } = this.getChildPropertyLocationInfo(property, columnValue);

      if (!group.children.length || !group.children.some(({ childDisplayName }) => childDisplayName === childName)) {
        const child = { ...property, childDisplayName: childName, id: childName, locationSelector };

        const indexToInsertChild = sortedIndexBy(group.children, child, 'childDisplayName');
        group.children.splice(indexToInsertChild, 0, child);
      }
    });

    const groupedProperties = Array.from(propertiesMap.values());
    return sortBy(groupedProperties, 'name');
  };

  groupPropertiesData = (response = []) => {
    const { properties } = response;

    return {
      properties,
      groupedProperties: this.groupPropertiesByFilter(properties, { columnTitle: this._columnTitle, columnValue: this._columnValue }),
    };
  };

  @observable
  _columnTitle = 'state';

  @observable
  _columnValue = 'region';

  @observable
  _groupedProperties;

  @computed
  get apiHost() {
    return this.webSiteService._apiHost;
  }

  @computed
  get residentServerURL() {
    const { domain } = parseApiHostURL(this.apiHost);

    return `https://resident.${domain}`;
  }

  @computed
  get tenantName() {
    return parseApiHostURL(this.apiHost)?.tenantName;
  }

  constructor() {
    const webSiteService = (this.webSiteService = getWebSiteService());
    this.selfServeService = getSelfServeService();

    this.propertiesRq = createCacheableRequestForWebsiteUtils({
      call: async () => await webSiteService.getProperties(),
      cachePrefix: 'propertiesRq',
      getId: async () => 'properties',
      cacheTimeout: 60 * 60 * 1000,
    });

    this.searchStore = new SearchStore({ webSiteStore: this });
    this.screenSizeStore = getScreenSizeStore();
    this.enableTrackUserActivity(appState.trackUserActivity);
    this.tracker = new Tracker({ webSiteStore: this });

    reaction(
      () => {
        const { currentPropertyStore } = this;
        const property = currentPropertyStore?.property;
        const loaded = currentPropertyStore?.loaded;

        return {
          property,
          loaded,
        };
      },
      ({ property, loaded }) => {
        if (!property || !loaded) return;
        const { city, region, state, neighborhood } = property;
        this.notifyEvent(Events.PROPERTY_LOADED, {
          eventLabel: `name-${property.name}`,
          marketing: {
            city,
            region,
            state,
            neighborhood,
          },
          category: Categories.SALES,
          component: Components.STORES,
        });
      },
    );
  }

  get propertyTabsStore() {
    if (!this._propertyTabsStore) {
      this._propertyTabsStore = new PropertyTabsStore();
    }
    return this._propertyTabsStore;
  }

  get genericMessageFormStore() {
    if (!this._genericMessageFormStore) {
      this._genericMessageFormStore = new GenericMessageFormStore({ webSiteStore: this });
    }
    return this._genericMessageFormStore;
  }

  addTrackingConsumer = fn => {
    this.tracker.addConsumer(fn);
  };

  notifyEvent = (...args) => {
    this.tracker.notify(...args);
  };

  @computed
  get storesFailed() {
    return !!this.propertiesRq.error || !!this.searchStore.searchError || !!this.currentPropertyStore?.error;
  }

  loadProperties = withCachedPromise(async () => {
    await this.propertiesRq.execCall();
  });

  @computed
  get properties() {
    return (this.propertiesRq.response || {}).properties;
  }

  @computed
  get columnTitle() {
    return this._columnTitle;
  }

  @computed
  get columnValue() {
    return this._columnValue;
  }

  @computed
  get groupedRegions() {
    const response = this.propertiesRq.response || {};
    return this.groupPropertiesData(response).groupedProperties;
  }

  @computed
  get lifestyles() {
    return (this.propertiesRq.response || {}).lifestyles || [];
  }

  @computed
  get marketingLayoutGroups() {
    return (this.propertiesRq.response || {}).marketingLayoutGroups || [];
  }

  @computed
  get marketingSearch() {
    return (this.propertiesRq.response || {}).marketingSearch || [];
  }

  @observable.shallow
  _currentPropertyStore;

  getCurrentPropertyStore(currentPropertyId) {
    if (!currentPropertyId) throw new Error('parameter currentPropertyId is required');

    const cachedInstance = propertyCache.get(currentPropertyId);

    if (cachedInstance) {
      return cachedInstance;
    }

    const instance = new PropertyStore({ propertyId: currentPropertyId, webSiteStore: this });

    propertyCache.set(currentPropertyId, instance);
    instance.loadPropertyInfo();

    return instance;
  }

  getInventoryStore(inventoryId) {
    if (!inventoryId) throw new Error('parameter inventoryId is required');
    const cachedInstance = inventoryCache.get(inventoryId);

    if (cachedInstance) {
      return cachedInstance;
    }

    const instance = new InventoryStore({ inventoryId, webSiteStore: this });

    inventoryCache.set(inventoryId, instance);
    instance.loadInventory();

    return instance;
  }

  @action
  setCurrentPropertyId = propertyId => {
    this.currentPropertyId = propertyId;
    this._currentPropertyStore = this.getCurrentPropertyStore(propertyId);
  };

  @action
  setColumnTitleAndValue({ columnTitle, columnValue }) {
    this._columnTitle = columnTitle || this._columnTitle;
    this._columnValue = columnValue || this._columnValue;
  }

  @computed
  get currentPropertyStore() {
    return this._currentPropertyStore;
  }

  @computed
  get selectedInventoryStore() {
    const { currentPropertyStore } = this;
    const inventoryId = currentPropertyStore?.layoutStore?.selectedInventoryId;

    if (!inventoryId) return {};

    return this.getInventoryStore(inventoryId);
  }

  getURLForProperty = ({ propertyId }) => {
    const property = this.properties.find(p => p.propertyId === propertyId);
    if (!property) {
      throw new Error(`Cannot find property with id${propertyId}`);
    }
    const urlParts = parseUrl(property.slugUrl);
    return urlParts.protocol ? urlParts.originalUrl : `${urlParts.pathname}${urlParts.search}${urlParts.hash}`;
  };

  getSearchUrl = (query, searchFilters = {}) => this.searchStore.getSearchUrl(query, searchFilters);

  @action
  _setPropertyFromSlug = slug => {
    const property = this.properties.find(p => p.slugUrl.indexOf(slug) > -1);
    if (property) {
      this.setCurrentPropertyId(property.propertyId);
    }
  };

  @action
  _setPropertyFromName = name => {
    const property = this.properties.find(p => p.name === name);

    if (!property) {
      throw new Error(`cannot find property with name ${name}`);
    }

    this.setCurrentPropertyId(property.propertyId);
  };

  @action
  setPropertyFromSlug = async slug => {
    await this.loadProperties();

    if (!this.loaded) {
      throw new Error('Properties not loaded');
    }

    this._setPropertyFromSlug(slug);
  };

  @action
  setPropertyFromName = async name => {
    await this.loadProperties();

    if (!this.loaded) {
      throw new Error('Properties not loaded');
    }

    this._setPropertyFromName(name);
  };

  getMarketingSession = () => this.webSiteService.getMarketingSession();
}

let storeInstance;

export const getWebSiteStore = () => {
  if (!storeInstance) {
    storeInstance = new WebSiteStore();
  }

  return storeInstance;
};
