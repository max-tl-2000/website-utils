/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

const pennantMultiple = require('!!url-loader!../resources/pennant-multiple.svg'); // eslint-disable-line import/no-webpack-loader-syntax
const pennantMultipleOutline = require('!!url-loader!../resources/pennant-multiple-outline.svg'); // eslint-disable-line import/no-webpack-loader-syntax

export const ZOOM_LEVEL = {
  CONTINENT: 3,
  CITY: 12,
};

export const CENTER_OF_USA_COORDINATES = { lat: 39, lng: -95 };

export const MIN_ZOOM = 0;
export const MAX_ZOOM = 22;

const white = '#ffffff';
const clustererLabelTextSize = 16;
export const markerClustererStyles = [
  {
    url: pennantMultiple,
    height: 58,
    width: 30,
    anchorText: [-10, -3],
    textColor: white,
    textSize: clustererLabelTextSize,
  },
  {
    url: pennantMultiple,
    height: 65,
    width: 37,
    anchorText: [-8, -4],
    textColor: white,
    textSize: clustererLabelTextSize,
  },
  {
    url: pennantMultiple,
    height: 77,
    width: 49,
    anchorText: [-5, -5],
    textColor: white,
    textSize: clustererLabelTextSize,
  },
  {
    url: pennantMultiple,
    height: 91,
    width: 63,
    anchorText: [-3, -7],
    textColor: white,
    textSize: clustererLabelTextSize,
  },
  {
    url: pennantMultiple,
    height: 105,
    width: 79,
    anchorText: [0, -9],
    textColor: white,
    textSize: clustererLabelTextSize,
  },
];

const markerLabelTxtColor = white;
const selectedMarkerLabelTxtColor = '#013849';

export const getPropertyMarkerIconLabel = (markerLabel, selected = false, isPropertyMap = false) =>
  markerLabel && !isPropertyMap
    ? {
        text: markerLabel,
        color: selected ? selectedMarkerLabelTxtColor : markerLabelTxtColor,
        fontSize: '12px',
        fontWeight: 'bold',
      }
    : null;

export const getMarkerCluster = (clusterer, marker) => {
  if (!clusterer || !marker) return null;

  return clusterer
    .getClusters()
    .filter(cluster => cluster.clusterIcon_.visible_)
    .find(cluster => cluster.isMarkerInClusterBounds(marker));
};

export const highlightMarkerCluster = (cluster, highlight = false) => {
  if (!cluster || !cluster.clusterIcon_) return;

  const { clusterIcon_ } = cluster;
  const { div_: iconDiv } = clusterIcon_;

  if (!iconDiv || !iconDiv.firstChild || !iconDiv.childNodes) return;

  const { firstChild: img } = iconDiv;
  const [, label] = iconDiv.childNodes;

  if (!img || !label || !label.attributes?.style?.nodeValue) return;

  const txtColor = `color: ${markerLabelTxtColor}`;
  const highlightedTxtColor = `color: ${selectedMarkerLabelTxtColor}`;
  const regex = new RegExp(highlight ? txtColor : highlightedTxtColor);

  // MarkerClustererPlus does not provide a proper way to change a single cluster icon,
  // this is a workaround to change the styling directly
  if (highlight) {
    img.src = pennantMultipleOutline;
    label.attributes.style.nodeValue = label.attributes.style.nodeValue.replace(regex, highlightedTxtColor);
    return;
  }

  img.src = pennantMultiple;
  label.attributes.style.nodeValue = label.attributes.style.nodeValue.replace(regex, txtColor);
};
