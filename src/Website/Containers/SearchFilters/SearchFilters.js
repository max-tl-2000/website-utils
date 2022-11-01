/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

import React, { Component } from 'react';
import { observer, inject, Observer } from 'mobx-react';
import { observable, action, reaction, computed } from 'mobx';
import classNames from 'classnames/bind';
import debounce from 'debouncy';

import { trans } from '../../../common/trans';
import SelectionGroup from '../../../components/SelectionGroup/SelectionGroup';
import TextBox from '../../../components/TextBox/TextBox';
import SizeAware from '../../../components/SizeAware/SizeAware';
import * as T from '../../../components/Typography/Typopgraphy';
import styles from './SearchFilters.scss';
import SearchFilterLoadingPlaceholder from './SearchFilterLoadingPlaceholder';
import { defaultBreakpointsAsArray, SMALL1 } from '../../../components/SizeAware/Breakpoints';
import PickBox from '../../../components/PickBox/PickBox';
import { Events, Categories, Components } from '../../helpers/tracking-helper';
import { toTitleCase } from '../../../common/strings';
import { getLabelFromFilters } from '../../../common/query-helper';

const cx = classNames.bind(styles);

const THRESHOLD_TO_UPDATE_PRICE = 800;

@inject(({ webSiteStore }) => ({
  webSiteStore,
  searchStore: webSiteStore.searchStore,
}))
@observer
export default class SearchFilters extends Component {
  @observable.shallow
  breakpoints;

  @observable
  currentWidth;

  componentWillMount() {
    // whenever filtersLoaded change
    reaction(() => {
      const { filtersLoaded } = this.props.searchStore;
      return { filtersLoaded };
      // we want to peform the search
    }, this.performSearchIfNeeded);

    // it might be that at this time filters are already loaded
    // that's why we call it immediately
    this.performSearchIfNeeded();
  }

  @action
  performSearchIfNeeded = () => {
    const { searchStore } = this.props;
    const { filtersLoaded } = searchStore;

    if (filtersLoaded) {
      searchStore.performSearch();
    }
  };

  renderItemTemplate = (item, { selectItem }) => {
    const { verticalMenu } = this.props;

    return (
      <PickBox
        tabIndex={0}
        big={verticalMenu}
        onClick={selectItem}
        value={item.id}
        label={toTitleCase(item.text)}
        checked={item.selected}
        white={verticalMenu}
        labelClassName={cx('filterLabel')}
      />
    );
  };

  renderSelectionGroupFilter = (items, { title, filterKey, textField, valueField, className, cols }) => {
    if (!items.length) return <noscript />;

    const { searchFilters } = this.props.searchStore;
    const { updateSearchFilter } = this;

    const onItemKeyDown = ({ e, selectItem }) => {
      if (e.key === 'Enter') {
        selectItem(e);
      }
    };

    return (
      <div className={cx(className)} data-id={`selectionGroup-${title}`}>
        <T.Caption className={cx('filterTitle')}>{title}</T.Caption>
        <SelectionGroup
          data-id={`selectionGroup-${title}`}
          multiple
          gutter={10}
          cols={cols}
          items={items}
          value={searchFilters[filterKey]}
          itemTemplate={this.renderItemTemplate}
          onChange={args => updateSearchFilter(filterKey, args.ids)}
          textField={textField}
          valueField={valueField}
          onItemKeyDown={onItemKeyDown}
        />
      </div>
    );
  };

  renderFloorplanTypeFilter = floorPlanTypes =>
    this.renderSelectionGroupFilter(floorPlanTypes, {
      title: trans('FLOORPLAN_TYPE', 'Floorplan type'),
      filterKey: 'marketingLayoutGroups',
      textField: 'displayName',
      valueField: 'id',
      className: 'floorplanTypeFilter',
      cols: 1,
    });

  renderLifestylesFilter = lifestyles =>
    this.renderSelectionGroupFilter(lifestyles, {
      title: trans('LIFESTYLES', 'Lifestyles'),
      filterKey: 'lifestyles',
      textField: 'displayName',
      valueField: 'displayName',
      className: 'lifestylesFilter',
      cols: this.props.verticalMenu ? 1 : 2,
    });

  updateSearchFilter = (filter, value) => {
    const { searchStore, webSiteStore } = this.props;
    const { updateFilter } = searchStore;

    if (updateFilter) {
      updateFilter(filter, value);

      webSiteStore.notifyEvent(Events.SEARCH_FILTERS_CHANGE, {
        ...searchStore.searchFilters,
        eventLabel: getLabelFromFilters(searchStore.searchFilters),
        category: Categories.SEARCH,
        Component: Components.SEARCH_FILTERS,
      });
    }
  };

  updateMarketRent = debounce(args => {
    // const { updateFilter } = this.props.searchStore;
    const { updateSearchFilter } = this;
    updateSearchFilter('marketRent', args.value);
  }, THRESHOLD_TO_UPDATE_PRICE);

  // TODO: format as number, but for that we need to create a wrapper of textbox because the type number does not allow commas
  renderPriceFilter = ({ searchFilters } = this.props.searchStore) => (
    <div className={cx('priceFilter')} data-id={'selectionGroup-Price'}>
      <T.Caption className={cx('filterTitle')}>{trans('PRICE', 'Price')}</T.Caption>
      <TextBox
        small={!this.props.verticalMenu}
        wide={!this.props.verticalMenu}
        type="number"
        wrapperId="price-filter"
        placeholder={trans('MAX_RENT', '$ max rent')}
        value={searchFilters.marketRent || ''}
        onChange={this.updateMarketRent}
        textAlign="right"
      />
    </div>
  );

  @action
  handleBreakpointChange = ({ matches, width }) => {
    this.currentWidth = width;
    this.breakpoints = matches;
  };

  @computed
  get isVerticalDesign() {
    const { currentWidth } = this;
    return currentWidth < SMALL1;
  }

  render() {
    const { searchStore, verticalMenu } = this.props;
    const { breakpoints, isVerticalDesign } = this;
    const { lifestyles } = searchStore;

    return (
      <SizeAware
        className={cx('searchFilters', breakpoints, { verticalMenu })}
        breakpoints={defaultBreakpointsAsArray}
        onBreakpointChange={this.handleBreakpointChange}>
        {!searchStore.filtersLoaded && <SearchFilterLoadingPlaceholder vertical={isVerticalDesign} />}
        {searchStore.filtersLoaded && (
          <>
            <Observer>{() => this.renderFloorplanTypeFilter(searchStore.marketingLayoutGroups)}</Observer>
            <Observer>{() => this.renderLifestylesFilter(lifestyles)}</Observer>
            <Observer>{() => this.renderPriceFilter()}</Observer>
          </>
        )}
      </SizeAware>
    );
  }
}
