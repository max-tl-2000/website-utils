/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import classNames from 'classnames/bind';
import QueryFilter from '../QueryFilter/QueryFilter';
import styles from './SearchBox.scss';
import { Events, Categories, Components } from '../../helpers/tracking-helper';
import { getLabelFromQuery } from '../../../common/query-helper';

const cx = classNames.bind(styles);

@observer
export class SearchBoxComponent extends Component {
  handleResultClick = params => {
    const {
      query: { propertyId },
      label,
    } = params;
    const { webSiteStore, actions: { onSuggestionClick } = {}, subContext } = this.props;

    const commonProps = {
      category: Categories.NAVIGATION,
      component: Components.SEARCH_BOX,
      subContext,
    };

    if (propertyId) {
      const url = webSiteStore.getURLForProperty({ propertyId });

      if (onSuggestionClick) {
        webSiteStore.notifyEvent(Events.SEARCH_BOX_RESULT_CLICK, { query: params.query, eventLabel: label, ...commonProps });

        setTimeout(() => onSuggestionClick({ url, propertyId }), 200);
      }
      return;
    }

    if (onSuggestionClick) {
      const url = webSiteStore.getSearchUrl(params.query);

      webSiteStore.notifyEvent(Events.SEARCH_BOX_RESULT_CLICK, { query: params.query, eventLabel: getLabelFromQuery(params.query), ...commonProps });

      setTimeout(() => onSuggestionClick({ url, label }), 200);
    }
  };

  render() {
    const { webSiteStore, selectedItem, className, inputClassName } = this.props;
    const { properties } = webSiteStore;
    return (
      <div className={cx('SearchBox', className)}>
        <QueryFilter properties={properties} inputClassName={inputClassName} selectedItem={selectedItem} onItemClick={this.handleResultClick} />
      </div>
    );
  }
}

export default inject('webSiteStore', 'actions')(SearchBoxComponent);
