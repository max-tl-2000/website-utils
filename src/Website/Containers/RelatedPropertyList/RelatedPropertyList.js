/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';

import { reaction } from 'mobx';
import LoadingBlock from '../../../components/LoadingBar/LoadingBlock';
import { trans } from '../../../common/trans';
import * as T from '../../../components/Typography/Typopgraphy';
import ResponsivePropertyCardGrid from '../PropertyCardGrid/ResponsivePropertyCardGrid';

@inject('webSiteStore')
@observer
export default class RelatedPropertyList extends Component {
  loadProperties = () => {
    const { webSiteStore } = this.props;
    const { currentPropertyStore = {} } = webSiteStore;
    const { relatedPropertiesStore = {} } = currentPropertyStore;

    // this is needed becasue when this component is mount it might be that we don't yet have
    // a propertyStore because we need to wait for the properties to be loaded from the backend
    // (or cache) for that reason if we already have it we call loadProperties and return
    if (relatedPropertiesStore.loadProperties) {
      relatedPropertiesStore.loadProperties();
      return;
    }

    // in case we don't have a valid currentPropertyStore
    // we might have it later after the call to `/marketing/properties` is resolved
    // so we start a reaction to observe changes to the currentPropertyStore
    const stopReaction = reaction(
      () => ({ propertyStore: webSiteStore.currentPropertyStore }),
      ({ propertyStore }) => {
        if (!propertyStore) return;
        // if we have a propertyStore then we call loadProperties
        // and since the propertyStore won't change then we can just clear the reaction
        propertyStore.relatedPropertiesStore.loadProperties();
        stopReaction && stopReaction();
      },
    );
  };

  componentDidMount() {
    this.loadProperties();
  }

  handlePropertyClick = item => {
    const { onPropertyClick, webSiteStore } = this.props;
    const url = webSiteStore.getURLForProperty(item);

    onPropertyClick && onPropertyClick({ ...item, url });
  };

  render() {
    const { webSiteStore, usePropertyImageHelper, on3DTourClick } = this.props;
    const { currentPropertyStore = {} } = webSiteStore;
    const { relatedPropertiesStore = {} } = currentPropertyStore;

    let gutter = 32;

    const properties = relatedPropertiesStore.properties || [];

    if (properties.length === 2) {
      gutter = 64;
    }

    return (
      <div style={{ position: 'relative' }}>
        {relatedPropertiesStore.error && <T.Text error>{trans('RELATED_PROPERTIES_FETCH_ERROR', 'An error occured fetching the related properties')}</T.Text>}
        {relatedPropertiesStore.loading && <LoadingBlock />}
        {relatedPropertiesStore.loaded && (
          <ResponsivePropertyCardGrid
            lazy
            gutter={gutter}
            alignment="center"
            verticalGutter={gutter}
            minCardWidth={350}
            properties={properties}
            usePropertyImageHelper={usePropertyImageHelper}
            onPropertyClick={this.handlePropertyClick}
            on3DTourClick={on3DTourClick}
            showRank={false}
          />
        )}
      </div>
    );
  }
}
