/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames/bind';
import { observable, reaction, action } from 'mobx';
import { observer } from 'mobx-react';
import styles from './RevaMap.scss';
import { loadGoogleMapsApi, loadGoogleMapsInfoBoxApi, loadGoogleMapsMarkerClustererApi, loadGoogleMapsRichMarkerApi } from '../../../common/initGoogleMapsApi';
import PropertyInfoBox from './PropertyInfoBox';
import {
  ZOOM_LEVEL,
  CENTER_OF_USA_COORDINATES,
  MIN_ZOOM,
  MAX_ZOOM,
  markerClustererStyles,
  getPropertyMarkerIconLabel,
  getMarkerCluster,
  highlightMarkerCluster,
} from './helpers/Map';
import { isNumber } from '../../../common/type-of';
import PoiInfoWindow from './PoiInfoWindow';
import PoiToggleButton from './PoiToggleButton';
import PoiMarker from './PoiMarker';

const propertyMarkerIcon = require('!!url-loader!./resources/pennant.svg'); // eslint-disable-line import/no-webpack-loader-syntax
const selectedPropertyMarkerIcon = require('!!url-loader!./resources/pennant-outline.svg'); // eslint-disable-line import/no-webpack-loader-syntax

const cx = classNames.bind(styles);

@observer
export default class RevaMap extends Component {
  MAP_INIT_TIMEOUT = 100;

  DEFAULT_MAP_OPTIONS = {
    center: CENTER_OF_USA_COORDINATES,
    zoom: ZOOM_LEVEL.CONTINENT,
  };

  map;

  infoBox;

  infoBoxListener;

  markerClusterer;

  propertyMarkers = [];

  propertyPoiMarkers = [];

  poiMarkersVisible = false;

  propertyMarkersMap = new Map();

  @observable.shallow
  selectedInfo;

  prevSelectedInfo;

  poiToggleButton;

  getGeoLocation = geoLocation => {
    const { lat, lng } = geoLocation || {};

    if (!isNumber(lat) || !isNumber(lng)) return null;
    const latIsValid = lat >= -90 && lat <= 90;
    const lngIsValid = lng >= -180 && lng <= 180;

    if (!latIsValid || !lngIsValid) return null;

    const { LatLng } = this.googleMapsApi;

    return new LatLng(lat, lng);
  };

  getMapPropertyMarkerBounds = (properties = []) => {
    const { LatLng, LatLngBounds } = this.googleMapsApi;

    if (!properties.length) {
      const { lat, lng } = CENTER_OF_USA_COORDINATES;
      return new LatLngBounds().extend(new LatLng(lat, lng));
    }

    const { getGeoLocation } = this;

    return properties.reduce((acc, property) => {
      const geoLocation = getGeoLocation(property.geoLocation);
      geoLocation && acc.extend(geoLocation);
      return acc;
    }, new LatLngBounds());
  };

  getMarkerClusterer = () => {
    if (this.markerClusterer) return this.markerClusterer;

    this.markerClusterer = new window.MarkerClusterer(this.getMap(), this.propertyMarkers, {
      averageCenter: true,
      styles: markerClustererStyles,
      maxZoom: ZOOM_LEVEL.CITY,
    });

    this.googleMapsEvent.addListener(this.markerClusterer, 'mouseover', cluster => {
      highlightMarkerCluster(cluster, true);
    });

    this.googleMapsEvent.addListener(this.markerClusterer, 'mouseout', cluster => {
      highlightMarkerCluster(cluster, false);
    });

    return this.markerClusterer;
  };

  getInfoBox = () => {
    if (this.infoBox) return this.infoBox;

    const { Size } = this.googleMapsApi;

    this.infoBox = new window.InfoBox({
      zIndex: 10,
      pixelOffset: new Size(-160, -330),
      closeBoxURL: '',
      isHidden: false,
    });

    return this.infoBox;
  };

  get infoWindow() {
    if (this.infoWindowInstance) return this.infoWindowInstance;

    const { googleMapsApi } = this;
    const { InfoWindow, Size } = googleMapsApi;
    this.infoWindowInstance = new InfoWindow({
      pixelOffset: new Size(0, -50),
    });

    return this.infoWindowInstance;
  }

  toggleInfoBoxVisible = () => {
    const { getInfoBox } = this;
    const infoBox = getInfoBox();

    !infoBox.getVisible() && infoBox.setVisible(true);
  };

  getPropertyMarkerIcon = (selected = false) => {
    const { Point, Size } = this.googleMapsApi;

    const markerIconProperties = {
      scaledSize: new Size(24, 52),
      origin: new Point(0, 0),
      anchor: new Point(12, 42),
      labelOrigin: new Point(12, 12),
    };

    return {
      url: selected ? selectedPropertyMarkerIcon : propertyMarkerIcon,
      ...markerIconProperties,
    };
  };

  getPropertyMarkerIconAndLabel = (markerLabel, selected = false) => {
    const { getPropertyMarkerIcon, props } = this;

    return {
      icon: getPropertyMarkerIcon(selected),
      label: getPropertyMarkerIconLabel(markerLabel, selected, props.isPropertyMap),
    };
  };

  setPropertyMarkerIconSelection = (marker, selected = false) => {
    if (!marker) return;
    const { getPropertyMarkerIconAndLabel } = this;

    const { text } = marker.getLabel() || '';
    const { icon, label } = getPropertyMarkerIconAndLabel(text, selected);

    marker.setIcon(icon);
    marker.setLabel(label);
  };

  selectPropertyMarker = marker => {
    this.setPropertyMarkerIconSelection(marker, true);
  };

  deselectPropertyMarker = marker => {
    this.setPropertyMarkerIconSelection(marker, false);
  };

  togglePropertyMarkerSelection = () => {
    const { selectedInfo, prevSelectedInfo, deselectPropertyMarker, selectPropertyMarker } = this;
    const { marker: prevMarker, property: prevProperty } = prevSelectedInfo;
    const { marker, property } = selectedInfo;

    if (prevProperty && property.propertyId !== prevProperty.propertyId) {
      deselectPropertyMarker(prevMarker);
      selectPropertyMarker(marker);
      return;
    }

    selectPropertyMarker(marker);
  };

  renderInfoBox = () => {
    const { property: prevProperty } = this.prevSelectedInfo || {};
    const { marker, property } = this.selectedInfo;
    const { props, getInfoBox, getMap, toggleInfoBoxVisible, googleMapsEvent } = this;
    const { usePropertyImageHelper, onPropertyClick } = props;

    const infoBox = getInfoBox();
    const map = getMap();

    if (prevProperty && prevProperty.propertyId === property.propertyId) {
      toggleInfoBoxVisible();
      return;
    }

    this.infoBoxListener && googleMapsEvent.removeListener(this.infoBoxListener);
    infoBox.close();

    const propertyInfoBoxContainer = document.createElement('div');

    ReactDOM.render(<PropertyInfoBox property={property} usePropertyImageHelper={usePropertyImageHelper} />, propertyInfoBoxContainer);

    infoBox.setContent(propertyInfoBoxContainer);
    this.infoBoxListener = googleMapsEvent.addDomListener(infoBox.content_, 'click', () => onPropertyClick && onPropertyClick(property, marker.__rank));

    infoBox.setVisible(true);
    const { onMarkerOpen } = props;
    onMarkerOpen && onMarkerOpen(property, marker.__rank);
    infoBox.open(map, marker);

    map.panTo(infoBox.getPosition());
  };

  handlePropertyChange = () => {
    this.renderInfoBox();
    this.togglePropertyMarkerSelection();
  };

  highlightProperty = property => {
    const { propertyId, event } = property;

    const marker = this.propertyMarkersMap.get(propertyId);
    if (!marker) return;

    const { getMarkerClusterer, selectPropertyMarker, deselectPropertyMarker, getInfoBox } = this;
    const cluster = getMarkerCluster(getMarkerClusterer(), marker);

    if (event === 'mouseover') {
      selectPropertyMarker(marker);
      // Only highlight the marker cluster if the property marker
      // is clustered. If clustered, getMap() returns undefined.
      if (!marker.getMap()) highlightMarkerCluster(cluster, true);
      return;
    }

    highlightMarkerCluster(cluster, false);

    const { propertyId: selectedPropertyId } = (this.selectedInfo || {}).property || '';

    if (selectedPropertyId !== propertyId) {
      deselectPropertyMarker(marker);
      return;
    }

    !getInfoBox().getVisible() && deselectPropertyMarker(marker);
  };

  @action
  setSelectedInfo = ({ marker, property }) => {
    const { searchStore } = this.props;

    this.selectedInfo = {
      marker,
      property,
    };
    searchStore && searchStore.setSelectedProperty(property);
  };

  setHighlightedProperty = (property, event) => {
    const { searchStore } = this.props;
    const { propertyId } = property;
    searchStore && searchStore.setHighlightedProperty({ propertyId, event });
  };

  createPropertyMarker = (property, markerLabel, rank) => {
    const { getMap, googleMapsApi, getGeoLocation, getPropertyMarkerIconAndLabel } = this;
    const { Marker } = googleMapsApi;
    const { displayName } = property;
    const geoLocation = getGeoLocation(property.geoLocation);

    if (!geoLocation) return null;

    const propertyMarker = new Marker({
      map: getMap(),
      title: displayName,
      position: geoLocation,
      ...getPropertyMarkerIconAndLabel(markerLabel),
    });

    propertyMarker.__rank = rank;

    propertyMarker.addListener('click', () => {
      this.prevSelectedInfo = { ...(this.selectedInfo || {}) };
      this.setSelectedInfo({ marker: propertyMarker, property });
    });

    propertyMarker.addListener('mouseover', () => {
      this.setHighlightedProperty(property, 'mouseover');
      this.selectPropertyMarker(propertyMarker);
    });

    propertyMarker.addListener('mouseout', () => {
      this.setHighlightedProperty(property, 'mouseout');
      const { propertyId: selectedPropertyId } = (this.selectedInfo || {}).property || '';

      if (property.propertyId !== selectedPropertyId) {
        this.deselectPropertyMarker(propertyMarker);
        return;
      }

      if (!this.getInfoBox().getVisible()) this.deselectPropertyMarker(propertyMarker);
    });

    this.propertyMarkersMap.set(property.propertyId, propertyMarker);

    return propertyMarker;
  };

  createPropertyPoiMarker = ({ geometry, name, vicinity, cat }) => {
    const { getMap, getGeoLocation, infoWindow } = this;
    const geoLocation = getGeoLocation(geometry.location);

    if (!geoLocation || !cat) return null;

    const map = getMap();
    const poiMarkerContent = document.createElement('div');
    ReactDOM.render(<PoiMarker category={cat} name={name} />, poiMarkerContent);

    const propertyPoiMarker = new window.RichMarker({
      map,
      position: geoLocation,
      visible: false,
      content: poiMarkerContent,
      flat: true,
      anchor: window.RichMarkerPosition.BOTTOM,
    });

    if (name && vicinity) {
      const poiInfoWindow = document.createElement('div');
      ReactDOM.render(<PoiInfoWindow name={name} vicinity={vicinity} />, poiInfoWindow);

      propertyPoiMarker.addListener('click', () => {
        infoWindow.setContent(poiInfoWindow);
        infoWindow.open(map, propertyPoiMarker);

        // This is done this way because the google apis do not
        // provide an event object when the listener is called.
        const { event } = window;
        event && event.stopPropagation();
      });
    }

    return propertyPoiMarker;
  };

  placePropertyMarkers = (properties = []) => {
    if (!properties.length) return properties;
    return properties
      .map((property, index) => {
        const rank = index + 1;
        return this.createPropertyMarker(property, `${rank}`, rank);
      })
      .filter(marker => marker);
  };

  placePropertyPoiMarkers = (propertyPointsOfInterest, poiPerCategory = 5) => {
    const { poi = {} } = propertyPointsOfInterest;

    return Object.keys(poi).reduce((acc, cat) => {
      const categoryPoi = poi[cat] || [];
      acc = [
        ...acc,
        ...categoryPoi
          .slice(0, poiPerCategory)
          .map(p => this.createPropertyPoiMarker({ ...p, cat }))
          .filter(m => m),
      ];
      return acc;
    }, []);
  };

  placePropertiesPoiMarkers = (properties = []) =>
    [].concat(...properties.map(property => this.placePropertyPoiMarkers(property.propertyPointsOfInterest || {})));

  getPropertyMapZoomLevel = ({ mapZoomLevel }) => (typeof mapZoomLevel === 'number' ? mapZoomLevel : -1);

  getMapZoomLevel = (properties = []) => {
    const { DEFAULT_MAP_OPTIONS, getPropertyMapZoomLevel, getGeoLocation } = this;

    if (!properties.length) return DEFAULT_MAP_OPTIONS.zoom;

    if (properties.length === 1) {
      const propertyGeoLocation = getGeoLocation(properties[0].geoLocation);
      const propertyMapZoomLevel = propertyGeoLocation ? getPropertyMapZoomLevel(properties[0]) : DEFAULT_MAP_OPTIONS.zoom;
      const isValidZoomLevel = propertyMapZoomLevel >= MIN_ZOOM && propertyMapZoomLevel <= MAX_ZOOM;
      return isValidZoomLevel ? propertyMapZoomLevel : ZOOM_LEVEL.CITY;
    }

    return ZOOM_LEVEL.CITY;
  };

  getMapCenter = (properties = []) => {
    const { DEFAULT_MAP_OPTIONS, getGeoLocation } = this;
    const mapCenter = !properties.length ? DEFAULT_MAP_OPTIONS.center : getGeoLocation(properties[0].geoLocation);
    return mapCenter || DEFAULT_MAP_OPTIONS.center;
  };

  drawMapMarkers = () => {
    const {
      getMapPropertyMarkerBounds,
      placePropertyMarkers,
      getInfoBox,
      getMap,
      props,
      getMapCenter,
      getMapZoomLevel,
      getMarkerClusterer,
      placePropertiesPoiMarkers,
    } = this;
    const { properties = [] } = props;
    const infoBox = getInfoBox();
    const map = getMap();
    const clusterer = getMarkerClusterer();

    this.propertyMarkers.forEach(marker => {
      marker.setMap(null);
    });

    this.propertyPoiMarkers.forEach(marker => {
      marker.setMap(null);
    });

    this.propertyMarkersMap.clear();

    infoBox.close();
    this.propertyMarkers = placePropertyMarkers(properties);
    this.propertyPoiMarkers = placePropertiesPoiMarkers(properties);
    clusterer.clearMarkers();
    clusterer.addMarkers(this.propertyMarkers);

    map.setCenter(getMapCenter(properties));
    map.setZoom(getMapZoomLevel(properties));

    if (properties.length > 1) map.fitBounds(getMapPropertyMarkerBounds(properties));
  };

  get googleApi() {
    return window.google;
  }

  get googleMapsApi() {
    const { googleApi } = this;
    return googleApi && googleApi.maps;
  }

  get googleMapsEvent() {
    const { googleMapsApi } = this;
    return googleMapsApi && googleMapsApi.event;
  }

  clearMapSelection = () => {
    const { getInfoBox, deselectPropertyMarker } = this;

    getInfoBox().setVisible(false);
    deselectPropertyMarker((this.selectedInfo || {}).marker);
  };

  handlePoiBtnToggle = () => {
    const visible = !this.poiMarkersVisible;

    this.propertyPoiMarkers.forEach(poiMarker => {
      poiMarker.setVisible(visible);
    });

    this.poiMarkersVisible = visible;
    this.infoWindow.close();
  };

  get poiToggleBtn() {
    if (this.poiToggleButton) return this.poiToggleButton;

    this.poiToggleButton = document.createElement('div');
    ReactDOM.render(<PoiToggleButton onClick={this.handlePoiBtnToggle} />, this.poiToggleButton);
    return this.poiToggleButton;
  }

  getMap = () => {
    if (this.map) return this.map;

    const { DEFAULT_MAP_OPTIONS, mapDOMNode, googleMapsApi, clearMapSelection, props, poiToggleBtn } = this;
    const { Map: GoogleMap, ControlPosition } = googleMapsApi;

    this.map = new GoogleMap(mapDOMNode, DEFAULT_MAP_OPTIONS);

    googleMapsApi.event.addListener(this.map, 'zoom_changed', () => clearMapSelection());
    googleMapsApi.event.addListener(this.map, 'click', () => clearMapSelection());
    googleMapsApi.event.addListener(this.map, 'idle', () => {
      if (!props.isPropertyMap) return;
      const mapWidthPoiBtnBreakpoint = 480;
      const hasPoiBtnAtTheTop = !this.map.controls[ControlPosition.LEFT_BOTTOM].length;
      const hasPoiBtnAtTheBottom = !this.map.controls[ControlPosition.TOP_LEFT].length;

      const mapWidth = this.map.getDiv().offsetWidth;
      if (mapWidth >= mapWidthPoiBtnBreakpoint && hasPoiBtnAtTheBottom) {
        this.map.controls[ControlPosition.LEFT_BOTTOM].clear();
        this.map.controls[ControlPosition.TOP_LEFT].push(poiToggleBtn);
      }

      if (mapWidth < mapWidthPoiBtnBreakpoint && hasPoiBtnAtTheTop) {
        this.map.controls[ControlPosition.TOP_LEFT].clear();
        this.map.controls[ControlPosition.LEFT_BOTTOM].push(poiToggleBtn);
      }
    });

    return this.map;
  };

  initMap = () => {
    if (!this.googleMapsApi) {
      console.error('Google Maps api must be loaded');
      return;
    }

    this.map = this.getMap();
  };

  componentDidUpdate(prevProps) {
    // This is here because we have to wait for the map and infobox
    // apis to be fully initialized as react will call this method
    // and not wait for componentDidMount to finish
    if (!this.mapInitialize) {
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.componentDidUpdate(prevProps);
      }, this.MAP_INIT_TIMEOUT);

      return;
    }

    const { drawMapMarkers, props } = this;
    const { properties } = props;

    if (properties && properties !== (prevProps || {}).properties) {
      drawMapMarkers();
    }
  }

  componentWillUnmount() {
    this.stopHandlePropertyChangeReaction && this.stopHandlePropertyChangeReaction();
    this.stopHighlightPropertyReaction && this.stopHighlightPropertyReaction();
    clearTimeout(this.timer);
  }

  async componentDidMount() {
    try {
      await loadGoogleMapsApi();
      await Promise.all([loadGoogleMapsInfoBoxApi(), loadGoogleMapsMarkerClustererApi(), loadGoogleMapsRichMarkerApi()]);
    } catch (err) {
      console.error(err);
    }

    this.initMap();

    const { properties, searchStore } = this.props;
    if (properties && properties.length) {
      this.drawMapMarkers();
    }

    this.stopHandlePropertyChangeReaction = reaction(() => ({ selectedInfo: this.selectedInfo }), this.handlePropertyChange);
    if (searchStore) this.stopHighlightPropertyReaction = reaction(() => searchStore.highlightedProperty, this.highlightProperty);
    this.mapInitialize = true;
  }

  render() {
    return <div className={cx('Map', { loading: !this.googleMapsApi })} ref={ref => (this.mapDOMNode = ref)} />;
  }
}
