/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { action } from 'mobx';
import classNames from 'classnames/bind';

import QueryFilter from '../QueryFilter/QueryFilter';
import styles from './SearchBoxFilter.scss';
import { navigateTo } from '../../helpers/navigator';
import { Categories, Components, SubContexts, Events } from '../../helpers/tracking-helper';
import { getLabelFromQuery } from '../../../common/query-helper';

const cx = classNames.bind(styles);

@inject('webSiteStore')
@observer
export default class SearchBoxFilter extends Component {
  commonNotificationProps = {
    category: Categories.NAVIGATION,
    component: Components.SEARCH_BOX,
    subContext: SubContexts.SEARCH_FILTERS,
  };

  @action
  handleResultClick = q => {
    const {
      query: { propertyId },
      label,
    } = q;

    const { commonNotificationProps, props } = this;

    const { webSiteStore } = props;

    if (propertyId) {
      const url = webSiteStore.getURLForProperty({ propertyId });
      webSiteStore.notifyEvent(Events.SEARCH_BOX_RESULT_CLICK, { query: q.query, eventLabel: label, ...commonNotificationProps });
      navigateTo(url);
      return;
    }

    const { searchStore } = webSiteStore;
    const url = webSiteStore.getSearchUrl(q.query, searchStore.searchFilters);
    navigateTo(url);

    webSiteStore.notifyEvent(Events.SEARCH_BOX_RESULT_CLICK, { query: q.query, eventLabel: getLabelFromQuery(q.query), ...commonNotificationProps });
  };

  @action
  handleClear = () => {
    const { webSiteStore } = this.props;
    const { searchStore } = webSiteStore;
    searchStore.clearQuery();
    // TODO: verify category is the correct one
    webSiteStore.notifyEvent(Events.SEARCH_BOX_CLEAR, { ...this.commonNotificationProps, category: Categories.USER_ACTION });
  };

  render() {
    const { props } = this;
    const { inputClassName } = props;
    const { properties, searchStore } = props.webSiteStore;
    const { queryLabel } = searchStore;
    return (
      <div className={cx('SearchBox')}>
        <QueryFilter
          properties={properties}
          inputClassName={inputClassName}
          selectedItem={queryLabel}
          onClear={this.handleClear}
          onItemClick={this.handleResultClick}
        />
      </div>
    );
  }
}
