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
import { loadYTAPI, getVideoId } from '../../common/yt-helper';
import styles from './BackgroundVideo.scss';
import BackgroundVideoWrapper from './BackgroundVideoWrapper';
import BackgroundVideoModel from './BackgroundVideoModel';

const cx = classNames.bind(styles);

@observer
export class YoutubeBgVideo extends Component {
  constructor(props) {
    super(props);
    this.model = new BackgroundVideoModel({ fallback: props.fallback });
    this.doLoadYTAPI();
  }

  async doLoadYTAPI() {
    this.YT = await loadYTAPI();
  }

  storeRef = async ref => {
    this.ref = ref;

    if (!ref) {
      return;
    }

    await this.doLoadYTAPI();
    const { YT } = this;

    this.setLoading(true);
    this.player = new YT.Player(ref, {
      height: this.height || 315,
      width: this.width || 560,
      playerVars: {
        autohide: 1,
        autoplay: 0,
        controls: 0,
        enablejsapi: 1,
        iv_load_policy: 3,
        loop: 0,
        modestbranding: 1,
        playsinline: 1,
        rel: 0,
        showinfo: 0,
      },
      events: {
        onReady: this.loadVideo,
        onStateChange: this.handlePlayerStateChange,
        onError: () => this.setLoading(false),
      },
    });
  };

  get videoId() {
    const { props } = this;
    const { src } = props;
    const vid = getVideoId(src);

    return vid;
  }

  loadVideo = () => {
    const { player, props } = this;
    const { src } = props;
    const vid = getVideoId(src);

    player.loadVideoById({ videoId: vid });
    player.mute();

    this.setSizeForPlayer(player, { w: this.width, h: this.height });
  };

  @action
  setLoading = val => {
    this.model.setLoading(val);
  };

  @action
  handlePlayerStateChange = async e => {
    const { YT } = this;

    if (e.data === YT.PlayerState.PLAYING) {
      this.model.showPlayer();
    }
    if (e.data === YT.PlayerState.ENDED) {
      this.model.showPlayer();
      this.player.playVideo();
    }

    const videoId = getVideoId(this.player.getVideoUrl());

    if (e.data === YT.PlayerState.PAUSED) {
      if (this.videoId !== videoId) {
        this.loadVideo();
      }

      this.player.playVideo();
    }

    if (e.data === YT.PlayerState.CUED) {
      this.player.stopVideo();

      if (this.videoId !== videoId) {
        this.loadVideo();
      }

      this.player.playVideo();
    }
  };

  handleSizeChange = ({ width, height }) => {
    const w = (this.width = width + 200);
    const h = (this.height = height + 200);

    const { player } = this;
    if (!player) return;

    this.setSizeForPlayer(player, { w, h });
  };

  setSizeForPlayer(player, { w, h }) {
    if (w / h > 16 / 9) {
      player.setSize(w, (w / 16) * 9);
    } else {
      player.setSize((h / 9) * 16, h);
    }
  }

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
        <div className={cx('video')}>
          <div ref={this.storeRef} />
        </div>
      </BackgroundVideoWrapper>
    );
  }
}
