/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

import React, { Component } from 'react';
import { observable, action, computed, reaction } from 'mobx';
import { observer, Observer } from 'mobx-react';
import '@redisrupt/react-responsive-carousel/lib/styles/carousel.min.css';
import { Carousel as RRCarousel } from '@redisrupt/react-responsive-carousel';
import classnames from 'classnames/bind';
import { trans } from '../../common/trans';
import styles2 from './Carousel.scss';
import IconButton from '../IconButton/IconButton';
import Picture from '../Picture/Picture';
import * as Assets from './Assets';
import ArrowLeft from '../../resources/svgs/arrow-left.svg';
import ArrowRight from '../../resources/svgs/arrow-right.svg';
import { YoutubeBgVideo } from '../BackgroundVideo/YoutubeBgVideo';
import { VimeoBgVideo } from '../BackgroundVideo/VimeoBgVideo';
import { isYoutubeUrl } from '../../common/yt-helper';
import { isVimeoUrl } from '../../common/vimeo-helper';
import Iframe from '../Iframe/Iframe';
import Revealer from '../Revealer/Revealer';
import { CarouselItem } from './CarouselItem';

const cx = classnames.bind(styles2);

const ContentTypes = {
  NONE: 0,
  PICTURES: 1,
  VIDEOS: 2,
  TOURS: 3,
  BG_VIDEO: 4,
};

const HideButtonsDelay = 3000;

@observer
export default class Carousel extends Component {
  static defaultProps = {
    height: 450,
    setHeight: true,
  };

  @observable
  _contentType = ContentTypes.NONE;

  componentDidMount() {
    this.stopTypeChangeTracking = reaction(
      () => {
        const { contentType } = this;
        return { contentType };
      },
      () => this.queueHideButtons(),
    );

    this.queueHideButtons();
  }

  @action
  hideButtons = () => {
    this.showingButtons = false;
  };

  componentWillUnmount() {
    clearInterval(this._buttonTimer);
    this.stopTypeChangeTracking && this.stopTypeChangeTracking();
  }

  @computed
  get contentType() {
    const { _contentType: cType, props } = this;
    const { pictures, videos, tours, bgVideo } = props;

    if (!cType || cType === ContentTypes.NONE) {
      if (pictures?.length) return ContentTypes.PICTURES;
      if (bgVideo) return ContentTypes.BG_VIDEO;
      if (videos?.length) return ContentTypes.VIDEOS;
      if (tours?.length) return ContentTypes.TOURS;
    }

    return cType;
  }

  @action
  setContentType = contentType => {
    if (contentType !== this._contentType) {
      this._contentType = contentType;
    }
  };

  @computed
  get multipleItems() {
    const { contentType } = this;
    let retVal;

    switch (contentType) {
      case ContentTypes.PICTURES:
        retVal = this.props.pictures?.length > 1;
        break;
      case ContentTypes.VIDEOS:
        retVal = this.props.videos?.length > 1;
        break;
      case ContentTypes.TOURS:
        retVal = this.props.tours?.length > 1;
        break;
      case ContentTypes.BG_VIDEO:
        retVal = false;
        break;
      default:
        retVal = false;
        break;
    }

    return retVal;
  }

  renderImage = image => {
    const url = image.source;
    const { height, setHeight } = this.props;
    const { floorPlan = false } = image.metadata || {};

    const style = {
      ...(setHeight ? { height } : {}),
    };
    const backgroundSize = floorPlan ? 'contain' : 'cover';

    return (
      <CarouselItem key={image.source}>
        {/* Note: Dec 30th 2021 - Added in addCrossOriginHeader={false} as this was causing issues with aws assets */}
        <Picture src={url} alt={image.alt} backgroundSize={backgroundSize} style={style} className={cx({ test: floorPlan })} addCrossOriginHeader={false} />
      </CarouselItem>
    );
  };

  renderIFrame = (mediaObj, index) => {
    const { height } = this.props;
    const { source, fallback: fallbackImage } = mediaObj;

    return (
      <CarouselItem className={cx('iframe-wrapper')} key={source} style={{ height }}>
        <Iframe className={cx('iframe')} title={index} src={mediaObj.source} {...{ fallbackImage }} />
      </CarouselItem>
    );
  };

  renderSlides = (contentType, pictures, videos, tours) => {
    switch (contentType) {
      default:
      case ContentTypes.PICTURES:
        return (pictures || []).map(this.renderImage);
      case ContentTypes.VIDEOS:
        return (videos || []).map(this.renderIFrame);
      case ContentTypes.TOURS:
        return (tours || []).map(this.renderIFrame);
      case ContentTypes.BG_VIDEO:
        return this.renderBgVideo();
      case ContentTypes.NONE:
        return <noscript />;
    }
  };

  renderBgVideo = () => {
    const { bgVideo, height } = this.props;
    const { src, fallback } = bgVideo || {};

    if (isYoutubeUrl(src)) {
      return <YoutubeBgVideo src={src} fallback={fallback} height={height} />;
    }

    if (isVimeoUrl(src)) {
      return <VimeoBgVideo src={src} fallback={fallback} height={height} />;
    }

    throw new Error('background video not supported. Please use a vimeo or youtube video url');
  };

  queueHideButtons = () => {
    const { _buttonTimer, showingButtons, contentType } = this;
    clearInterval(this._buttonTimer);
    if (!showingButtons || contentType === ContentTypes.PICTURES) return;
    this._buttonTimer = setTimeout(() => this.hideButtons(), HideButtonsDelay);
  };

  @observable
  showingButtons = true;

  @action
  toggleShowingButtons = () => {
    this.showingButtons = !this.showingButtons;
  };

  @computed
  get togglerIcon() {
    return !this.showingButtons ? Assets.ChevronRight : Assets.ChevronLeft;
  }

  @computed
  get togglerTooltip() {
    return !this.showingButtons ? trans('SHOW_BUTTONS', 'Show Buttons') : trans('HIDE_BUTTONS', 'Hide Buttons');
  }

  render() {
    const {
      pictures,
      videos,
      tours,
      bgVideo,
      noBtnLabels,
      className,
      showIndicators = false,
      centeredAlignedIndicators = false,
      rightAlignedIndicators = false,
    } = this.props;

    const numberOfMediaTypes = [pictures, videos, tours].filter(array => !!array?.length).length;

    if (numberOfMediaTypes === 0 && !bgVideo) return <noscript />;

    const { multipleItems } = this;

    return (
      <div className={cx('Carousel', className)} data-id="carousel-wrapper">
        <div
          className={cx('CarouselContent', {
            centeredAlignedIndicators,
            rightAlignedIndicators,
            hideIndicators: showIndicators && !multipleItems,
            showIndicators: showIndicators && multipleItems,
          })}>
          <Observer>
            {() => (
              <RRCarousel
                dynamicHeight
                cloneItems
                showThumbs={false}
                showLegend={false}
                prevIcon={<ArrowLeft />}
                nextIcon={<ArrowRight />}
                showIndicators={showIndicators}
                showStatus={false}
                key={this.contentType}
                infiniteLoop={this.multipleItems}>
                {this.renderSlides(this.contentType, pictures, videos, tours)}
              </RRCarousel>
            )}
          </Observer>
        </div>
        <Observer>
          {() => {
            const showButtons = numberOfMediaTypes > 1 || (numberOfMediaTypes === 1 && bgVideo);

            const picturesSelected = this.contentType === ContentTypes.PICTURES;
            const bgVideoSelected = this.contentType === ContentTypes.BG_VIDEO;
            const videosSelected = this.contentType === ContentTypes.VIDEOS;
            const toursSelected = this.contentType === ContentTypes.TOURS;

            return (
              <>
                {showButtons && (
                  <div
                    data-part="carousel-actions"
                    className={cx('CarouselActions', {
                      MoveUp: !picturesSelected,
                    })}>
                    <div
                      data-id="carouselButtonsContainer"
                      className={cx(
                        'ButtonBar',
                        { mediumMarginBottom: rightAlignedIndicators && this.multipleItems },
                        { highMarginBottom: centeredAlignedIndicators && this.multipleItems },
                      )}>
                      <IconButton
                        className={cx('button', 'toggler')}
                        title={this.togglerTooltip}
                        icon={this.togglerIcon}
                        type="flat"
                        onClick={this.toggleShowingButtons}
                      />
                      <Revealer className={cx('buttonGroup')} show={this.showingButtons} enterClass={cx('enter')} exitClass={cx('exit')}>
                        {!!pictures?.length && (
                          <IconButton
                            className={cx('button', { SelectedButton: picturesSelected })}
                            icon={Assets.ImagesIcon}
                            type={picturesSelected ? 'raised' : 'flat'}
                            data-selected={picturesSelected}
                            label={noBtnLabels ? null : trans('PICTURES', 'Pictures')}
                            onClick={() => this.setContentType(ContentTypes.PICTURES)}
                          />
                        )}
                        {!!bgVideo && (
                          <IconButton
                            className={cx('button', { SelectedButton: bgVideoSelected })}
                            icon={Assets.ImagesIcon}
                            type={bgVideoSelected ? 'raised' : 'flat'}
                            data-selected={bgVideoSelected}
                            label={noBtnLabels ? null : trans('SHOWCASE', 'Showcase')}
                            onClick={() => this.setContentType(ContentTypes.BG_VIDEO)}
                          />
                        )}
                        {!!videos?.length && (
                          <IconButton
                            className={cx('button', { SelectedButton: videosSelected })}
                            icon={Assets.VideoIcon}
                            type={videosSelected ? 'raised' : 'flat'}
                            data-selected={videosSelected}
                            label={noBtnLabels ? null : trans('VIDEO', 'Video')}
                            onClick={() => this.setContentType(ContentTypes.VIDEOS)}
                          />
                        )}
                        {!!tours?.length && (
                          <IconButton
                            className={cx('button', { SelectedButton: toursSelected })}
                            icon={Assets.TourIcon}
                            type={toursSelected ? 'raised' : 'flat'}
                            data-selected={toursSelected}
                            label={noBtnLabels ? null : trans('TOUR', '3DTour')}
                            onClick={() => this.setContentType(ContentTypes.TOURS)}
                          />
                        )}
                      </Revealer>
                    </div>
                  </div>
                )}
              </>
            );
          }}
        </Observer>
      </div>
    );
  }
}
