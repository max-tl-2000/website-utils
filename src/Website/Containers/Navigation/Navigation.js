/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import classNames from 'classnames/bind';

import * as T from '../../../components/Typography/Typopgraphy';
import { trans } from '../../../common/trans';
import SizeAware from '../../../components/SizeAware/SizeAware';
import NavigationLoadingPlaceholder from './NavigationLoadingPlaceholder';

import styles from './Navigation.scss';
import { defaultBreakpointsAsArray } from '../../../components/SizeAware/Breakpoints';
import { Events, Categories, Components } from '../../helpers/tracking-helper';
import { getLabelFromQuery } from '../../../common/query-helper';

const cx = classNames.bind(styles);

class RegionGroup {
  groups = [];

  addRegion(region) {
    this.groups.push(region);
  }

  get regionsCount() {
    const { groups } = this;
    const itemCount = groups.reduce((acc, g) => {
      acc += g.children.length;
      return acc;
    }, 0);

    return groups.length + itemCount;
  }
}

@inject('webSiteStore', 'actions')
@observer
export default class Navigation extends Component {
  getQueryValue = (key, value) => ({ [key]: value });

  renderChildren(children = []) {
    return children.map(p => {
      const query = { ...this.getQueryValue(p.locationSelector, p.childDisplayName) };
      return (
        <li key={p.id}>
          <T.Link
            tabIndex={0}
            className={cx('propertyName')}
            lighterForeground
            href={this.getNavigationUrl(query)}
            onClick={e => this.handleOnClick(e, { query })}>
            {p.childDisplayName}
          </T.Link>
        </li>
      );
    });
  }

  handleOnClick = (e, args) => {
    e.preventDefault();
    const {
      actions: { onNavigationItemClick },
      webSiteStore,
    } = this.props;

    const url = webSiteStore.getSearchUrl(args?.query);

    webSiteStore.notifyEvent(Events.NAVIGATION_LINK_CLICK, {
      category: Categories.NAVIGATION,
      component: Components.NAVIGATION,
      query: args?.query,
      eventLabel: getLabelFromQuery(args?.query),
    });

    setTimeout(() => onNavigationItemClick({ url }), 200);
  };

  getNavigationUrl = query => {
    const { webSiteStore } = this.props;
    return webSiteStore.getSearchUrl(query);
  };

  getGroupedRegionsForBrekapoint = matches => {
    const { webSiteStore } = this.props;

    const { groupedRegions } = webSiteStore;

    const getNewCount = (acc, region) => {
      const prg = acc[acc.length - 1];
      return prg.regionsCount + region.children.length + 1;
    };

    const groupLimit = matches.medium ? 6 : 12;

    return groupedRegions.reduce((acc, region) => {
      if (acc.length === 0 || getNewCount(acc, region) > groupLimit) {
        const rg = new RegionGroup();
        rg.id = acc.length;
        rg.addRegion(region);
        acc.push(rg);
      } else {
        const prg = acc[acc.length - 1];
        prg.addRegion(region);
      }

      return acc;
    }, []);
  };

  renderGroups = (newGroups = []) => {
    const { webSiteStore } = this.props;
    const { columnTitle } = webSiteStore;

    return (
      <div className={cx('footerLinks')}>
        {newGroups.map(g => (
          <div key={g.id} className={cx('column')}>
            {g.groups.map(group => {
              const query = this.getQueryValue(columnTitle, group.name);
              return (
                <div className={cx('regionGroup')} key={group.id}>
                  <T.Link
                    className={cx('stateTitle')}
                    lighterForeground
                    bold
                    uppercase
                    href={this.getNavigationUrl(query)}
                    onClick={e => this.handleOnClick(e, { query })}
                    tabIndex={0}>
                    {group.name}
                  </T.Link>
                  {group.children.length > 0 && <ul>{this.renderChildren(group.children)}</ul>}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    );
  };

  render() {
    const { webSiteStore, elevatingMarketsLayout = false } = this.props;
    return (
      <SizeAware
        skipRenderIfHidden={false}
        data-component="navigation"
        className={cx('navigation', { 'elevated-layout': elevatingMarketsLayout })}
        breakpoints={defaultBreakpointsAsArray}>
        {({ matches }) => {
          const newGroups = this.getGroupedRegionsForBrekapoint(matches);
          return (
            <div data-part="nav-container" className={cx('container', matches)}>
              {webSiteStore.loading && <NavigationLoadingPlaceholder breakpoints={matches} />}
              {webSiteStore.loaded && !elevatingMarketsLayout && (
                <T.Title lighterForeground className={cx('title')}>
                  {trans('FOOTER_TITLE', 'Explore Apartment Homes Across the Midwest')}
                </T.Title>
              )}
              {webSiteStore.loaded && this.renderGroups(newGroups)}
            </div>
          );
        }}
      </SizeAware>
    );
  }
}
