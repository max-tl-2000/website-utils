/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

import { observable, action, computed } from 'mobx';
import throttle from 'throttly';
import { qsa } from '../../common/dom';

const THROTTLE_THRESHOLD = 200;

export default class PropertyTabsStore {
  @observable.shallow
  _sections = observable.map({}, { deep: false });

  @observable
  selectedSection;

  handleScroll = throttle(
    action(() => {
      const { sections, scrollingElement } = this;
      const { scrollTop } = scrollingElement;

      const selectedSection = [...sections].sort((a, b) => (Math.abs(a.offsetTop - scrollTop) > Math.abs(b.offsetTop - scrollTop) ? 1 : -1))[0];

      if (selectedSection !== this.selectedSection) {
        this.selectedSection = selectedSection;
      }
    }),
    THROTTLE_THRESHOLD,
  );

  get scrollingElement() {
    return document.scrollingElement || document.querySelector('html');
  }

  @action
  loadFromDOM = selector => {
    const elements = qsa(selector);
    elements.forEach(ele => {
      this._sections.set(ele.id, ele);
    });

    window.addEventListener('scroll', this.handleScroll, true);
  };

  @computed
  get sections() {
    return Array.from(this._sections.values());
  }
}
