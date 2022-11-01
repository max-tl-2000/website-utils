/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

import React, { Component } from 'react';
import classNames from 'classnames/bind';
import { observer, inject } from 'mobx-react';
import styles from './SearchMap.scss';
import RevaMap from './RevaMap';
import { Events, Components, Categories, SubContexts } from '../../helpers/tracking-helper';

const cx = classNames.bind(styles);

@observer
export class SearchMapComponent extends Component {
  handleMarkerOpen = (item, rank) => {
    const { onMarkerOpen } = this.props;
    onMarkerOpen && onMarkerOpen(item, rank);
  };

  handlePropertyClick = (item, rank) => {
    const { onPropertyClick } = this.props;
    onPropertyClick && onPropertyClick(item, rank);
  };

  render() {
    const { searchStore, usePropertyImageHelper } = this.props;
    const { searchResults } = searchStore;

    return (
      <div className={cx('SearchMap')}>
        <RevaMap
          onMarkerOpen={this.handleMarkerOpen}
          onPropertyClick={this.handlePropertyClick}
          properties={searchResults}
          usePropertyImageHelper={usePropertyImageHelper}
          searchStore={searchStore}
        />
      </div>
    );
  }
}

@observer
export class SearchMapStandAlone extends Component {
  handleMarkerOpen = (item, rank) => {
    const { webSiteStore } = this.props;
    webSiteStore.notifyEvent(Events.MAP_MARKER_CLICK, {
      propertyId: item.propertyId,
      propertyName: item.name,
      propertyDisplayName: item.displayName,
      eventLabel: item.displayName,
      rank,
      category: Categories.NAVIGATION,
      component: Components.MAP,
      subContext: SubContexts.MAP,
    });
  };

  handlePropertyClick = (item, rank) => {
    const { actions = {} } = this.props;
    const { webSiteStore } = this.props;
    const url = webSiteStore.getURLForProperty(item);

    actions.onPropertyClick && actions.onPropertyClick({ ...item, url }, rank);
    webSiteStore.notifyEvent(Events.MAP_PROPERTY_CARD_CLICK, {
      component: Components.MAP,
      category: Categories.NAVIGATION,
      eventLabel: item.displayName,
      propertyId: item.propertyId,
      propertyName: item.propertyName,
      propertyDisplayName: item.displayName,
      rank,
    });
  };

  render() {
    const { searchStore, usePropertyImageHelper } = this.props;
    return (
      <SearchMapComponent
        usePropertyImageHelper={usePropertyImageHelper}
        searchStore={searchStore}
        onMarkerOpen={this.handleMarkerOpen}
        onPropertyClick={this.handlePropertyClick}
      />
    );
  }
}

const SearchMap = inject(({ webSiteStore, actions }) => ({
  searchStore: webSiteStore.searchStore,
  actions,
  webSiteStore,
}))(SearchMapStandAlone);

export default SearchMap;
