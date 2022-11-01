/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

import React, { Component } from 'react';
import { observer, inject, Observer } from 'mobx-react';
import classNames from 'classnames/bind';
import { observable, action, computed } from 'mobx';

import * as T from '../../../components/Typography/Typopgraphy';
import { trans } from '../../../common/trans';
import SizeAware from '../../../components/SizeAware/SizeAware';
import SvgAlert from '../../../resources/svgs/alert.svg';
import SearchResultsLoadingPlaceholder from './SearchResultsLoadingPlaceholder';
import styles from './SearchResultList.scss';
import { defaultBreakpointsAsArray } from '../../../components/SizeAware/Breakpoints';
import ResponsivePropertyCardGrid from '../PropertyCardGrid/ResponsivePropertyCardGrid';
import SelectionGroup from '../../../components/SelectionGroup/SelectionGroup';
import { SearchMapComponent } from '../Map/SearchMap';
import TitlePlaceholder from '../LoadingPlaceholders/TitlePlaceholder';
import { Events, Categories, Components, SubContexts } from '../../helpers/tracking-helper';

const cx = classNames.bind(styles);

@inject(({ actions, webSiteStore }) => ({
  webSiteStore,
  searchStore: webSiteStore.searchStore,
  actions,
  screenSizeStore: webSiteStore.screenSizeStore,
}))
@observer
export default class SearchResultList extends Component {
  @observable
  containerWidth;

  @observable.shallow
  breakpoints;

  @action
  handleBreakpointChange = ({ width, matches }) => {
    this.containerWidth = width;
    this.breakpoints = matches;
  };

  handlePropertyClick = (item, rank) => {
    this.handleClickAndNotify({
      item,
      rank,
      component: Components.PROPERTY_CARD_GRID,
    });
  };

  handleClickAndNotify({ item, rank, component, subContext } = {}) {
    const { actions: { onPropertyClick } = {}, webSiteStore } = this.props;
    const url = webSiteStore.getURLForProperty(item);

    onPropertyClick && onPropertyClick({ ...item, url });

    webSiteStore.notifyEvent(Events.PROPERTY_CARD_CLICK, {
      propertyId: item.propertyId,
      propertyName: item.name,
      propertyDisplayName: item.displayName,
      eventLabel: item.displayName,
      rank,
      category: Categories.NAVIGATION,
      component,
      subContext,
    });
  }

  handlePropertyClickFromMap = (item, rank) => {
    this.handleClickAndNotify({
      item,
      rank,
      component: Components.MAP,
      subContext: SubContexts.MAP,
    });
  };

  handle3DClick = item => {
    const { actions: { on3DTourClick } = {}, searchStore } = this.props;
    const url = searchStore.webSiteStore.getURLForProperty(item);
    on3DTourClick && on3DTourClick({ ...item, url });
  };

  handlePropertyHover = (property, e) => {
    if (!property || !e) return;

    e.stopPropagation && e.stopPropagation();

    const { searchStore } = this.props;
    const { propertyId } = property;

    searchStore.setHighlightedProperty({ propertyId, event: e.type });
  };

  options = [{ id: 'LIST', text: 'List' }, { id: 'MAP', text: 'Map' }];

  @observable.shallow
  selectedOption = ['LIST'];

  renderTab = (item, { selectItem }) => (
    <div
      className={cx('tabInner', { selected: item.selected })}
      onClick={e => !item.selected && selectItem(e)}
      data-value={item.id}
      data-label={item.text}
      data-checked={item.selected}>
      <T.Text raw className={cx('tabLabel')}>
        {item.text}
      </T.Text>
    </div>
  );

  @action
  handleTabChange = ({ ids }) => {
    this.selectedOption = ids;
  };

  @computed
  get isListSelected() {
    const [selectedId] = this.selectedOption;
    return selectedId === 'LIST';
  }

  @computed
  get isMapSelected() {
    const [selectedId] = this.selectedOption;
    return selectedId === 'MAP';
  }

  renderMap() {
    const { searchStore } = this.props;
    return (
      <div className={cx('mapBlock')}>
        <SearchMapComponent searchStore={searchStore} onPropertyClick={this.handlePropertyClickFromMap} onMarkerOpen={this.handleMarkerOpen} />
      </div>
    );
  }

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

  render() {
    const { props } = this;
    const { searchStore, screenSizeStore } = props;

    // TODO: only observe the things that need to be rendered here
    const { resultsCount, loaded, loading, displayRelatedResults } = searchStore;

    const communityLabel = resultsCount === 1 ? 'apartment community' : 'apartment communities';
    const resultsCountLabel = trans('RESULTS_LENGTH_MSG', 'Found {{resultsCount}} {{communityLabel}}', { resultsCount, communityLabel });

    const searchList = (
      <Observer>
        {() => {
          const { usePropertyImageHelper } = props;
          const { searchResults } = searchStore;
          const shouldRenderList = loaded && (!!resultsCount || displayRelatedResults);

          if (!shouldRenderList) return <noscript />;

          return (
            <ResponsivePropertyCardGrid
              lazy
              usePropertyImageHelper={usePropertyImageHelper}
              properties={searchResults}
              verticalGutter={32}
              minCardWidth={250}
              onPropertyClick={this.handlePropertyClick}
              on3DTourClick={this.handle3DClick}
              onPropertyHover={this.handlePropertyHover}
              searchStore={searchStore}
            />
          );
        }}
      </Observer>
    );

    let content = searchList;

    if (!screenSizeStore.matchMedium) {
      content = (
        <Observer>
          {() => (
            <>
              <SelectionGroup
                className={cx('tabs')}
                itemClassName={cx('tab')}
                items={this.options}
                itemTemplate={this.renderTab}
                onChange={this.handleTabChange}
                value={this.selectedOption}
              />
              <div className={cx('mobileList', { visible: this.isListSelected })}>
                {loading && <SearchResultsLoadingPlaceholder breakpoints={this.breakpoints} containerWidth={this.containerWidth} />}
                {loaded && searchList}
              </div>
              {this.isMapSelected && this.renderMap()}
            </>
          )}
        </Observer>
      );
    }

    return (
      <SizeAware
        className={cx('search-result-list', this.breakpoints)}
        breakpoints={defaultBreakpointsAsArray}
        onBreakpointChange={this.handleBreakpointChange}>
        {!resultsCount && !screenSizeStore.matchMedium && loading && (
          <div className={cx('smallResultsCount')}>
            <TitlePlaceholder />
          </div>
        )}
        {loaded && !!resultsCount && (
          <div className={cx('smallResultsCount')}>
            <T.Caption data-part="search-results-found-label" className={cx('countLabel')}>
              {resultsCountLabel}
            </T.Caption>
          </div>
        )}
        <div className={cx('search-result-header')}>
          {!resultsCount && loading && !screenSizeStore.matchMedium && <TitlePlaceholder />}
          {loaded && (
            <T.Title data-part="search-results-title" className={cx('title', 'serifFont')}>
              {trans('SEARCH_RESULT_LIST_TITLE', 'Search Results')}
            </T.Title>
          )}
          {loaded && !!resultsCount && (
            <T.Text data-part="search-results-found-label" className={cx('results-found-text')}>
              {resultsCountLabel}
            </T.Text>
          )}
        </div>
        {loaded && displayRelatedResults && (
          <>
            <div className={cx('no-exacts-results-block')}>
              <span className={cx('icon')}>
                <SvgAlert />
              </span>
              <T.Text data-part="search-results-no-exact-match-message" className={cx('no-exact-results-msg')}>
                {trans('NO_FILTERS_MATCH_MSG', "We couldn't find any exact matches. Try changing your filters to find a matching property.")}
              </T.Text>
            </div>
            <T.Title data-part="search-results-other-communities" className={cx('other-communities-title', 'serifFont')}>
              {trans('OTHER_COMMUNITIES_TITLE', 'Other communities in the area')}
            </T.Title>
          </>
        )}
        {loading && screenSizeStore.matchMedium && (
          <SearchResultsLoadingPlaceholder displayTitle breakpoints={this.breakpoints} containerWidth={this.containerWidth} />
        )}
        {content}
      </SizeAware>
    );
  }
}
