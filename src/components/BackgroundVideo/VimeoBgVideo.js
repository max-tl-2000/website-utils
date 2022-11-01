/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

import React, { Component } from 'react';
import { action } from 'mobx';
import { observer } from 'mobx-react';
import classNames from 'classnames/bind';
import { loadVimeoAPI, getVideoId } from '../../common/vimeo-helper';
import styles from './BackgroundVideo.scss';
import BackgroundVideoWrapper from './BackgroundVideoWrapper';
import BackgroundVideoModel from './BackgroundVideoModel';
import nullish from '../../common/nullish';

const cx = classNames.bind(styles);

@observer
export class VimeoBgVideo extends Component {
  constructor(props) {
    super(props);
    this.model = new BackgroundVideoModel({ fallback: props.fallback });
    this.doLoadVimeoAPI();
  }

  async doLoadVimeoAPI() {
    await loadVimeoAPI();
  }

  storeRef = async ref => {
    this.ref = ref;

    if (!ref) {
      return;
    }

    const Vimeo = await loadVimeoAPI();
    this.setLoading(true);
    this.player = new Vimeo.Player(ref, {
      id: getVideoId(this.props.src),
      height: this.height || 315,
      width: this.width || 560,
      title: 0,
      byline: 0,
      playsinline: 1,
      loop: 0,
      controls: 0,
      muted: 0,
      autoplay: 0,
      background: 1,
    });

    await this.player.ready();
    this.handlePlayerReady();
    this.player.on('play', this.handleBufferStart);
    this.player.on('error', () => this.setLoading(false));

    this.setIframeStyles();
  };

  handlePlayerReady = () => {
    const { player } = this;

    player.setMuted(true);
    player.setLoop(true);
    player.play();

    this.setSizeForPlayer(player, { w: this.width, h: this.height });
  };

  @action
  setLoading = val => this.model.setLoading(val);

  @action
  handleBufferStart = () => this.model.showPlayer();

  @action
  handleSizeChange = ({ width, height }) => {
    const w = (this.width = width + 200);
    const h = (this.height = height + 200);

    this.setSizeForPlayer({ w, h });
  };

  @action
  setSizeForPlayer({ w, h }) {
    let sizes = {};
    if (nullish(w) || nullish(h)) return;
    if (w / h > 16 / 9) {
      sizes = {
        width: w,
        height: (w / 16) * 9,
      };
    } else {
      sizes = {
        width: (h / 9) * 16,
        height: h,
      };
    }

    this.model.setSizes(sizes);
    this.setIframeStyles();
  }

  buildIframeStyles = () => {
    const stylesObject = {
      ...(!nullish(this.model.height) ? { height: `${this.model.height}px` } : {}),
      ...(!nullish(this.model.width) ? { width: `${this.model.width}px` } : {}),
    };

    return Object.keys(stylesObject).reduce((acc, styleProp) => {
      acc += `${styleProp}:${stylesObject[styleProp]};`;
      return acc;
    }, '');
  };

  setIframeStyles = () => {
    if (!this.ref) return;

    const iframeStyles = this.buildIframeStyles();
    const iframe = this.ref.querySelector('iframe');
    iframe && iframe.setAttribute('style', iframeStyles);
  };

  render() {
    const { fallback, height, className, displayLoadingIndicator = false } = this.props;

    return (
      <BackgroundVideoWrapper
        fallback={fallback}
        height={height}
        className={className}
        displayLoadingIndicator={displayLoadingIndicator}
        onSizeChange={this.handleSizeChange}
        model={this.model}>
        <div className={cx('video')} ref={this.storeRef} />
      </BackgroundVideoWrapper>
    );
  }
}
