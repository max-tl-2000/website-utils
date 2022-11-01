/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

import React, { Component } from 'react';
import classNames from 'classnames/bind';
import { observable, action, computed } from 'mobx';
import { observer } from 'mobx-react';
import { v4 } from 'uuid';

import styles from './Picture.scss';

import Revealer from '../Revealer/Revealer';
import LoadingBlock from '../LoadingBar/LoadingBlock';
import * as T from '../Typography/Typopgraphy';
import { imgToDataURL, Image } from './PictureHelper';
import { trans } from '../../common/trans';

const cx = classNames.bind(styles);

const instancesMap = new Map();
let observerInstance;

const onEnterIntoViewport = entries => {
  for (const entry of entries) {
    if (entry.isIntersecting) {
      const instanceId = entry.target.getAttribute('data-instance-id');
      const instance = instancesMap.get(instanceId);
      if (instance) {
        instance.loadImage();
      }
    }
  }
};

@observer
export default class Picture extends Component {
  @observable
  imageState = 'initial';

  @observable
  dataURI = '';

  @computed
  get loaded() {
    return this.imageState === 'loaded';
  }

  @computed
  get loading() {
    return this.imageState === 'loading';
  }

  @computed
  get loadingError() {
    return this.imageState === 'error';
  }

  @action
  setLoaded = () => {
    this.imageState = 'loaded';
  };

  @action
  setLoading = () => {
    this.imageState = 'loading';
  };

  @action
  updateDataURI = (dataURI, img) => {
    this.dataURI = dataURI;
    const { onImageLoaded } = this.props;
    onImageLoaded && onImageLoaded({ width: img.width, dataUri: this.dataURI, height: img.height });

    this.setLoaded();
  };

  @action
  showImage = async img => {
    const { useDataURI } = this.props;
    if (!useDataURI) {
      this.updateDataURI(img.src, img);
      return;
    }

    const res = await imgToDataURL(img);

    this.updateDataURI(res, img);
  };

  @action
  showErrorImage = () => {
    this.imageState = 'error';
  };

  @action
  loadImage = () => {
    if (this.imageState === 'loaded') return;
    this.imageState = 'loading';
    const { src, addCrossOriginHeader = true } = this.props;

    if (!src) {
      this.showErrorImage();
      return;
    }

    const img = new Image();

    if (addCrossOriginHeader) {
      img.crossOrigin = 'anonymous';
    }

    img.onload = () => requestAnimationFrame(() => this.showImage(img));
    img.onerror = () => {
      console.error('error loading image', src);
      this.showErrorImage();
      const { onError } = this.props;
      onError && onError();
    };

    img.src = src;
  };

  componentWillUnmount() {
    const { instanceId } = this;
    instancesMap.delete(instanceId);
  }

  handleImageLoad() {
    const { lazy } = this.props;
    const { IntersectionObserver } = window;

    if (!IntersectionObserver || !lazy) {
      this.loadImage();
      return;
    }

    const insId = (this.instanceId = v4());
    instancesMap.set(insId, this);

    if (!observerInstance) {
      observerInstance = new IntersectionObserver(onEnterIntoViewport, { root: null, rootMargin: '0px', threshold: 0.5 });
    }
    const { pictureRef } = this;

    pictureRef.setAttribute('data-instance-id', insId);
    observerInstance.observe(pictureRef);
  }

  componentDidMount() {
    this.handleImageLoad();
  }

  componentDidUpdate(prevProps) {
    const { src: prevSrc } = prevProps;
    const { src } = this.props;

    if (prevSrc !== src) {
      this.setLoading();
      this.handleImageLoad();
    }
  }

  handleClick = e => {
    const { props, loaded, loadingError } = this;
    const { onClick } = props;
    onClick && onClick(e, { state: this.imageState, loaded, loadingError });
  };

  storeRef = ref => {
    this.pictureRef = ref;
  };

  render() {
    const { loaded, loading, loadingError, dataURI } = this;
    const {
      style,
      className,
      imgClassName,
      imageFailedText = trans('IMG_NOT_AVAILABLE', 'Image not available'),
      backgroundSize = 'contain',
      useImageTag = false,
      imgStyle,
      alt,
      caption,
      imageFailedWrapperClassName,
      imageFailedTextClassName,
      loadingBlockClassName,
    } = this.props;

    return (
      <div ref={this.storeRef} className={cx('wrapper', className, { useImageTag })} style={style} onClick={this.handleClick}>
        <Revealer skipFirst={false} className={cx('Revealer')} show={loaded}>
          {!useImageTag && (
            <div className={cx('bg-image', imgClassName)} style={{ backgroundImage: `url(${dataURI})`, backgroundSize, ...imgStyle }}>
              {caption && caption()}
            </div>
          )}
          {useImageTag && (
            <div className={cx('image-wrapper')}>
              <img alt={alt} style={imgStyle} className={cx('image', imgClassName)} src={dataURI} />
              {caption && caption()}
            </div>
          )}
        </Revealer>

        {loading && <LoadingBlock className={cx('loadingBlock', loadingBlockClassName)} />}
        {loadingError && (
          <Revealer skipFirst={false} className={cx(imageFailedWrapperClassName, 'Revealer')} show={loadingError}>
            <T.Text noMargin className={cx('noImage', imageFailedTextClassName)}>
              {imageFailedText}
            </T.Text>
          </Revealer>
        )}
      </div>
    );
  }
}
