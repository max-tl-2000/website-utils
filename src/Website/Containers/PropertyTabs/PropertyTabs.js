/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import classNames from 'classnames/bind';
import styles from './PropertyTabs.scss';
import * as T from '../../../components/Typography/Typopgraphy';
import SizeAware from '../../../components/SizeAware/SizeAware';
import { defaultBreakpointsAsArray } from '../../../components/SizeAware/Breakpoints';
import Button from '../../../components/Button/Button';
import { getScrollingElement } from '../../../common/scrolling-element';

const cx = classNames.bind(styles);

@inject(({ webSiteStore }) => ({
  propertyTabsStore: webSiteStore.propertyTabsStore,
}))
@observer
export default class PropertyTabs extends Component {
  scrollToSection = section => {
    const se = getScrollingElement();
    if (!se) return;
    se.scrollTop = section.offsetTop;
  };

  handleKeyDown = (e, section) => {
    if (e.key === 'Enter') {
      this.scrollToSection(section);
    }
  };

  render() {
    const { propertyTabsStore, compact } = this.props;
    if (!propertyTabsStore) return <noscript />;

    const { sections = [], selectedSection } = propertyTabsStore;

    const sectionsLength = sections.length;
    const width = `${Math.round(100 / sectionsLength)}%`;
    return (
      <SizeAware breakpoints={defaultBreakpointsAsArray}>
        {({ matches }) => (
          <div data-component="tabs" className={cx('PropertyTabs', matches, { compact })}>
            {sections.map(section => {
              const selected = section === selectedSection;
              const { dataset } = section;
              const short = dataset.revaSectionShort || dataset.revaSection;
              const label = matches.medium ? dataset.revaSection : short;
              return matches.small1 || compact ? (
                <div
                  tabIndex={0}
                  data-component="tab"
                  data-selected={selected}
                  className={cx('PropertyTab', { selected })}
                  key={section.id}
                  style={{ width }}
                  onKeyDown={e => this.handleKeyDown(e, section)}
                  onClick={() => this.scrollToSection(section)}>
                  <T.Text data-part="tabText" className={cx('labels')} secondary={!selected} uppercase noMargin>
                    {label}
                  </T.Text>
                </div>
              ) : (
                <Button
                  key={section.id}
                  btnRole={'secondary'}
                  label={label}
                  wide={!matches.xsmall2}
                  onKeyDown={e => this.handleKeyDown(e, section)}
                  onClick={() => this.scrollToSection(section)}
                  className={cx('button')}
                />
              );
            })}
          </div>
        )}
      </SizeAware>
    );
  }
}
