/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

import clsc from 'coalescy';
import { loadStyleSheet } from '../common/loader';
import { getCurrentModulePath, setAssetsBasePath } from '../common/currentResource';
import { initWebService } from '../Services/WebSiteService';
import { setGoogleMapsApiToken } from '../common/initGoogleMapsApi';
import { startScreenSizeChangeListener } from '../Website/helpers/startScreenSizeTracking';
import { hydrateComponentsFromMarkup } from './hydrateComponents';
import { document } from '../common/globals';
import { setDefaultFormat } from '../common/phone/phone-helper';
import { getWebSettings, clearWebSettingsIfHostTokenOrVersionChanged } from '../Website/helpers/settings-state';
import { renderSettingsUI } from './settingsUI';
import { parseQuery } from '../common/parseQuery';
import { qs } from '../common/dom';
import { getWebSiteStore } from '../Website/Stores/WebSiteStore';

/**
 * load the css base styles
 * @param {object} params
 * @param {string} params.fontURL
 * @param {string} params.style
 * @param {boolean} params.loadCSS
 *
 * @returns Promise
 */
export const loadBaseStyles = async ({ fontURL, styleURL, loadCSS } = {}) => {
  const promises = [];

  if (!loadCSS) return;

  if (fontURL) {
    const p = loadStyleSheet(fontURL);
    promises.push(p);
  }

  if (!styleURL) {
    styleURL = getCurrentModulePath().replace(/\.js$/, '.css');
  }

  const p = styleURL && loadStyleSheet(styleURL);
  promises.push(p);

  try {
    // load fonts and css stylesheets
    await Promise.all(promises);
  } catch (err) {
    console.log('>>> error loading styles', err);
  }
};

/**
 * initialize the reva utilities
 * @param {object} params
 * @param {string} params.fontURL the css font styles
 * @param {string} params.styleURL the main css file
 * @param {string} params.host the api endpoint hostname, it must include the protocol. Example https://cucumber.local.env.reva.tech
 * @param {string} params.token the token to use to authorize the endpoint
 * @param {boolean} params.loadCSS=true whether to autoload the styles or not. If true the styles will be autoloaded otherwise is the resposability of the consumer to include the css file
 * @param {string} defaultPhoneFormat=parentheses the default format for phones. Other options are dot and hyphen
 */
export const initUtils = (params = {}) => {
  const {
    fontURL = 'https://fonts.googleapis.com/css?family=Heebo:400,700,500|Lato',
    styleURL,
    host,
    token,
    loadCSS = true,
    googleMapsApiToken,
    trackWindowSizeChange = true,
    defaultPhoneFormat = 'hyphen',
    version = __PKG_VERSION__,
    autoLoadProperties = true,
    assetsBasePath,
  } = params;

  if (assetsBasePath) {
    setAssetsBasePath(assetsBasePath);
  }

  clearWebSettingsIfHostTokenOrVersionChanged({ host, token, version });

  const settings = getWebSettings() || {};

  const theHost = settings.host || host;
  const theToken = settings.token || token;
  const theGMTApiToken = settings.googleMapsApiToken || googleMapsApiToken;
  const theDefaultPhoneFormat = settings.defaultPhoneFormat || defaultPhoneFormat;
  const shouldTrackWindowSizeChange = clsc(settings.trackWindowSizeChange, trackWindowSizeChange);

  if (!theHost) {
    throw new Error('initUtils: "host" parameter not defined.');
  }

  if (!theToken) {
    throw new Error('initUtils: "token" parameter not defined');
  }

  if (theDefaultPhoneFormat) {
    setDefaultFormat(theDefaultPhoneFormat);
  }

  loadBaseStyles({ fontURL, styleURL, loadCSS });

  // we are using a single object that will contain all methods that we will use to communicate
  // with the backend endpoints. We pass both the host and token to initialize this service object
  // the webSiteService instance is a singleton. It can be accessed calling `getWebSiteService()`;
  initWebService({ host: theHost, token: theToken });

  theGMTApiToken && setGoogleMapsApiToken(theGMTApiToken);

  if (shouldTrackWindowSizeChange) {
    startScreenSizeChangeListener();
  }

  const qParams = parseQuery(window.location.search);

  const { showSettings } = qParams;

  const store = (window.__webSiteStore = getWebSiteStore());

  if (autoLoadProperties) {
    store.loadProperties();
  }

  document.addEventListener('DOMContentLoaded', () => {
    hydrateComponentsFromMarkup();

    const body = qs('body');

    const { classList } = body;

    const onAnimationEnd = e => {
      if (e.target !== body) return;

      classList.remove('reva-animation-enter');
      body.removeEventListener('animationend', onAnimationEnd);
    };

    body.addEventListener('animationend', onAnimationEnd);

    classList.remove('reva-not-ready');
    classList.add('reva-animation-enter');

    classList.add('reva-ready');

    if (showSettings) {
      renderSettingsUI({
        host,
        token,
        googleMapsApiToken,
        defaultPhoneFormat,
        trackWindowSizeChange,
      });
    }
  });
};
