/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

import { dirname } from 'path';
import { deferred } from './deferred';
import { document, window } from './globals';
import { getCurrentModulePath, getAssetsBasePath } from './currentResource';
import { combine } from './service-creator';

let googleMapsApiToken;
let mapsApiPromise;
let infoBoxApiPromise;
let markerClustererApiPromise;
let richMarkerApiPromise;

// TODO: for now this is using rawgit cdn, we need to find a more reliable cdn for this 3rd party api or we host ourselves
const infoBoxScript = '/maps-deps/infobox_packed.min.js'; // original from '//cdn.rawgit.com/googlemaps/v3-utility-library/master/infobox/src/infobox_packed.js';
const richMarkerScript = '/maps-deps/richmarker-compiled.min.js'; // original from '//cdn.rawgit.com/googlemaps/v3-utility-library/master/richmarker/src/richmarker-compiled.js';
const mapClustererScript = '/maps-deps/markerclusterer.min.js'; // original from '//cdnjs.cloudflare.com/ajax/libs/markerclustererplus/2.1.4/markerclusterer.min.js';

export const setGoogleMapsApiToken = token => {
  googleMapsApiToken = token;
};

const loadMapsApi = () => {
  mapsApiPromise = deferred();

  window.__google_api_init = () => {
    mapsApiPromise.resolve();
    window.___google_api_init = null;
  };

  const googleMapsApiScript = `//maps.googleapis.com/maps/api/js?key=${googleMapsApiToken}&callback=__google_api_init`;

  const script = document.createElement('script');
  script.src = googleMapsApiScript;

  script.onerror = () => {
    mapsApiPromise.reject(new Error('Google Maps api failed to load'));
  };

  document.body.appendChild(script);

  return mapsApiPromise;
};

export const loadGoogleMapsApi = () => {
  if (!mapsApiPromise) {
    mapsApiPromise = loadMapsApi();
  }

  return mapsApiPromise;
};

const loadGoogleMapsUtilityApi = src => {
  const promise = deferred();

  const script = document.createElement('script');
  script.src = src;

  script.onerror = () => {
    promise.reject(new Error(`Google Maps api ${src} failed to load`));
  };

  script.onload = () => {
    promise.resolve();
  };

  document.body.appendChild(script);

  return promise;
};

const getPathTo = script => {
  let folderName = getAssetsBasePath();

  if (!folderName) {
    const p = getCurrentModulePath();
    folderName = dirname(p);
  }

  const src = combine(folderName, script).replace(/^https:\/\//, '//');
  return src;
};

export const loadGoogleMapsInfoBoxApi = () => {
  if (!infoBoxApiPromise) {
    infoBoxApiPromise = loadGoogleMapsUtilityApi(getPathTo(infoBoxScript));
  }

  return infoBoxApiPromise;
};

export const loadGoogleMapsMarkerClustererApi = () => {
  if (!markerClustererApiPromise) {
    markerClustererApiPromise = loadGoogleMapsUtilityApi(getPathTo(mapClustererScript));
  }

  return markerClustererApiPromise;
};

export const loadGoogleMapsRichMarkerApi = () => {
  if (!richMarkerApiPromise) {
    richMarkerApiPromise = loadGoogleMapsUtilityApi(getPathTo(richMarkerScript));
  }

  return richMarkerApiPromise;
};
