/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

import { computed, action, observable, reaction } from 'mobx';
import debounce from 'debouncy';
import trim from 'jq-trim';

import Request from '../../common/request';
import { getWebSiteService } from '../../Services/WebSiteService';
import { serializeParams } from '../../common/serialize';
import { findMatchingSearch, getSearchFilters } from '../helpers/search';
import { parseUrl } from '../../common/parseUrl';

import nullish from '../../common/nullish';

const SEARCH_THRESHOLD = 500;

export default class SearchStore {
  @observable
  _searchFilters = {};

  @observable.shallow
  _query = {};

  @observable
  _highlightedProperty;

  @observable
  _selectedProperty;

  filterFields = ['marketingLayoutGroups', 'lifestyles', 'marketRent'];

  queryFields = ['neighborhood', 'region', 'city', 'state'];

  @computed
  get loading() {
    return this.searchRq.loading;
  }

  @computed
  get loaded() {
    return this.searchRq.success;
  }

  @computed
  get filtersLoaded() {
    return this.webSiteStore.loaded;
  }

  constructor({ webSiteStore }) {
    this.webSiteStore = webSiteStore;
    const websiteService = getWebSiteService();

    this.searchRq = Request.create({
      call: async args => {
        try {
          const results = await websiteService.search(args);

          if (!results || !results.length) {
            const { query } = args;
            const relatedResults = await websiteService.search({ query });
            return { results: [], relatedResults };
          }
          return { results, relatedResults: [] };
        } catch (error) {
          throw new Error('Error fetching search results', error);
        }
      },
      defaultResponse: { results: [], relatedResults: [] },
    });
  }

  search = async (...args) => {
    await this.searchRq.execCall(...args);
  };

  @computed
  get searchError() {
    return this.searchRq.error;
  }

  @computed
  get results() {
    return this.searchRq.response.results;
  }

  @computed
  get relatedResults() {
    return this.searchRq.response.relatedResults;
  }

  @computed
  get resultsCount() {
    return (this.searchRq.response.results || []).length;
  }

  @computed
  get displayRelatedResults() {
    return !!(this.searchRq.response.relatedResults || []).length;
  }

  @computed
  get searchResults() {
    return this.displayRelatedResults ? this.relatedResults : this.results;
  }

  @computed
  get lifestyles() {
    return this.webSiteStore.lifestyles;
  }

  @computed
  get marketingLayoutGroups() {
    return this.webSiteStore.marketingLayoutGroups;
  }

  @computed
  get searchFilters() {
    const { marketRent, ...restFilters } = this._searchFilters;
    return {
      ...restFilters,
      marketRent: marketRent ? Number(marketRent) : undefined,
    };
  }

  get highlightedProperty() {
    return this._highlightedProperty;
  }

  get selectedProperty() {
    return this._selectedProperty;
  }

  @action
  updateFilter = (filterKey, value) => {
    if (!this.filterFields.includes(filterKey)) return;

    if (trim(this._searchFilters[filterKey]) !== trim(value)) {
      this._searchFilters[filterKey] = value;
    }
  };

  @action
  performSearch = debounce(() => {
    const { searchFilters, _query } = this;
    this.search({
      query: _query,
      ...searchFilters,
    });
  }, SEARCH_THRESHOLD);

  getSearchUrl = (query = {}, searchFilters = {}) => {
    let scope;

    switch (true) {
      case !!query.neighborhood:
        scope = 'neighborhood';
        break;
      case !!query.city:
        scope = 'city';
        break;
      case !!query.region:
        scope = 'region';
        break;
      default:
        scope = 'state';
    }

    const { webSiteStore } = this;

    const matchingSearch = findMatchingSearch(webSiteStore.marketingSearch, query, scope);

    const urlParts = parseUrl(matchingSearch.url);
    const url = urlParts.protocol ? urlParts.originalUrl : `${urlParts.pathname}` || '';
    const params = matchingSearch.queryStringFlag ? { ...query, ...searchFilters } : searchFilters;
    const serializedParams = serializeParams(params);

    return serializedParams ? `${url}?${serializedParams}` : url;
  };

  setDefaultQuery = params => {
    const { queryFields, _query: currentQuery } = this;
    const query = {};

    Object.assign(query, currentQuery);

    queryFields.forEach(key => {
      const value = params[key];
      const currentQueryValue = query[key];
      const isAlreadySetOnQuery = currentQueryValue === value;
      if (!value && currentQueryValue) delete query[key];

      if (value && !isAlreadySetOnQuery) {
        query[key] = value;
      }
    });

    this.setQuery(query);
  };

  @action
  parseQueryFromUrl = async () => {
    const { webSiteStore } = this;
    await webSiteStore.loadProperties();

    const filters = getSearchFilters(window.location, webSiteStore.marketingSearch);
    const { filterFields } = this;
    filterFields.forEach(key => {
      const value = filters[key];
      if (value) {
        this._searchFilters[key] = value;
      }
    });

    this.setDefaultQuery(filters);

    reaction(
      () => ({ query: this._query, searchFilters: this.searchFilters }),
      async ({ query, searchFilters }) => {
        searchFilters = Object.keys(searchFilters).reduce((acc, key) => {
          const val = searchFilters[key];
          if (!nullish(val)) {
            acc[key] = val;
          }
          return acc;
        }, {});

        await this.webSiteStore.loadProperties();

        const url = this.getSearchUrl(query, searchFilters);

        window.history.replaceState({}, '', url);
        this.performSearch();
      },
    );
  };

  @action
  clearQuery = () => {
    this._query = undefined;
    this.queryLabel = { query: undefined, label: '' };
  };

  @action
  setQuery = q => {
    this._query = q;

    const label = this.queryFields
      .reduce((acc, key) => {
        const value = this._query[key];
        if (value) {
          acc.push(value);
        }
        return acc;
      }, [])
      .join(', ');

    this.queryLabel = { query: q, label };
  };

  @action
  setHighlightedProperty = property => {
    this._highlightedProperty = property;
  };

  @action
  setSelectedProperty = property => {
    this._selectedProperty = property;
  };

  @observable.shallow
  queryLabel;
}
