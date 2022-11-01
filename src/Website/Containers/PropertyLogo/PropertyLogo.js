/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import classNames from 'classnames/bind';
import { observable, action, computed } from 'mobx';
import throttle from 'throttly';
import Picture from '../../../components/Picture/Picture';
import styles from './PropertyLogo.scss';
import { getCloudinaryURLForImage } from '../../helpers/images';

const cx = classNames.bind(styles);

const THROTTLE_THRESHOLD = 200;

@inject('webSiteStore')
@observer
export default class PropertyLogo extends Component {
  @observable.shallow
  breakpoints;

  @observable
  currentLogo;

  @observable
  displayPropertyLogo;

  @observable
  usePropertyName;

  @observable
  errorLoadingImage;

  @action
  handleBreakpointChange = ({ matches }) => {
    this.breakpoints = matches;
  };

  @computed
  get propertyLogoUrl() {
    const { webSiteStore, propertyLogoUrl, wrapInCloudinary } = this.props;
    const { currentPropertyStore: propertyStore = {}, screenSizeStore } = webSiteStore;
    const { property = {} } = propertyStore;

    let logoUrl = property.logoUrl || propertyLogoUrl;

    if (wrapInCloudinary) {
      // remember to keep this in sync with the css file
      // TODO: maybe it is better to move this to the js file only
      const widthToRequest = screenSizeStore?.matchMedium ? 170 : 100;
      logoUrl = getCloudinaryURLForImage(logoUrl, { width: widthToRequest });
    }

    return this.errorLoadingImage ? undefined : logoUrl;
  }

  getDisplayInfo = () => {
    const { webSiteStore, tenantLogoUrl } = this.props;
    const { currentPropertyStore: propertyStore = {} } = webSiteStore;
    const { property = {} } = propertyStore;

    const tenantLogo = tenantLogoUrl;
    const propertyLogo = this.propertyLogoUrl;

    return { tenantLogo, propertyLogo, defaultText: property.displayName || '' };
  };

  checkScrollPosition = throttle(
    action(() => {
      const MAX_HEIGHT_THRESHOLD = 100;
      const { getDisplayInfo, props } = this;
      const { scrollableParent, triggerElement } = props;

      const scrollTop = scrollableParent.scrollTop;
      const displayPropertyLogo = scrollTop > triggerElement.offsetTop + MAX_HEIGHT_THRESHOLD;
      const { tenantLogo, propertyLogo } = getDisplayInfo();

      this.displayPropertyLogo = displayPropertyLogo;
      this.usePropertyName = displayPropertyLogo && !propertyLogo;
      this.currentLogo = displayPropertyLogo && propertyLogo ? propertyLogo : tenantLogo;
    }),
    THROTTLE_THRESHOLD,
  );

  componentDidMount() {
    const { checkScrollPosition } = this;
    window.addEventListener('scroll', checkScrollPosition, true);
    this.checkScrollPosition();
  }

  componentWillUnmount() {
    const { checkScrollPosition } = this;
    window.removeEventListener('scroll', checkScrollPosition, true);
  }

  storeRef = ref => {
    this.propertyLogoRef = ref;
  };

  handleClick = () => {
    const { onClick } = this.props;

    onClick && onClick({ isTenant: !this.displayPropertyLogo });
  };

  @action
  handleLoadingError = () => {
    this.errorLoadingImage = true;
    this.checkScrollPosition();
  };

  render() {
    const { tenantLogo, defaultText } = this.getDisplayInfo();
    const { usePropertyName, displayPropertyLogo } = this;
    const { currentLogo = tenantLogo, props } = this;
    const { webSiteStore, useDataURI, addCrossOriginHeader } = props;
    const { screenSizeStore } = webSiteStore;
    const matchMedium = screenSizeStore?.matchMedium;
    const pointer = !displayPropertyLogo;

    return (
      <div className={cx('propertyLogo', { medium: matchMedium })} data-component="property-logo">
        {!usePropertyName && <h1 className={cx('propertyNameHeader')}>{defaultText}</h1>}
        <Picture
          src={currentLogo}
          addCrossOriginHeader={addCrossOriginHeader}
          className={cx('logoImage', { pointer }, { usePropertyName })}
          backgroundSize={'contain'}
          onClick={this.handleClick}
          imageFailedText={defaultText}
          onError={this.handleLoadingError}
          imageFailedWrapperClassName={cx('useNameWrapper')}
          imageFailedTextClassName={cx('useNameText')}
          useDataURI={useDataURI}
        />

        {usePropertyName && (
          <div className={cx('propertyNameWrapper')} data-part="property-name-container">
            <h1 className={cx('useNameText')}>{defaultText}</h1>
          </div>
        )}
      </div>
    );
  }
}
