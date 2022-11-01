/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

/* eslint-disable jsx-a11y/no-noninteractive-tabindex */
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { observable, computed, action, reaction } from 'mobx';
import classNames from 'classnames/bind';
import debounce from 'debouncy';

import nullish from '../../common/nullish';
import Revealer from '../Revealer/Revealer';
import styles from './Dropdown.scss';
import * as T from '../Typography/Typopgraphy';
import { window } from '../../common/globals';
import scrollIntoView from '../../common/scrollIntoView';
import { trans } from '../../common/trans';

const cx = classNames.bind(styles);

@observer
export default class Dropdown extends Component {
  @observable
  selectedIndex = -1;

  @observable
  show = false;

  @observable
  focused = false;

  @observable.shallow
  items = [];

  @observable
  value;

  @computed
  get selectedItem() {
    const { items = [], value } = this;
    if (nullish(value)) return null;

    return items.find(entry => entry.id === value);
  }

  constructor(props) {
    super(props);
    this.value = props.value;
    this.items = props.items;

    this.stopReaction = reaction(
      () => ({
        sIndex: this.selectedIndex,
      }),
      ({ sIndex }) => this.scrollFocusedElementIntoViewport(sIndex),
    );
  }

  componentWillUnmount() {
    this.stopReaction && this.stopReaction();
  }

  scrollFocusedElementIntoViewport = () => {
    const { selectedIndex, refFlyOut } = this;

    if (selectedIndex > -1 && refFlyOut && refFlyOut.DOMNode) {
      const ele = refFlyOut.DOMNode.querySelector(`[data-idx="${selectedIndex}"]`);
      scrollIntoView(ele);
    }
  };

  @action
  componentDidUpdate() {
    const { props } = this;
    const { items, value } = props;

    if ('items' in props && items !== this.items) {
      this.items = items;
    }

    if ('value' in props && value !== this.value) {
      this.value = value;
    }
  }

  componentDidMount() {
    this.props.autoFocus && this.refTrigger.focus();
  }

  @action
  focusElementByIndex = idx => {
    if (idx === this.selectedIndex) {
      this.scrollFocusedElementIntoViewport(idx);
      return;
    }
    this.selectedIndex = idx;
  };

  @action
  _updateSelection = entry => {
    if (entry && entry.id !== this.value) {
      this.value = entry.id;
      const { onChange } = this.props;
      onChange && onChange({ value: this.value });
    }
  };

  @action
  updateSelection = entry => {
    this._updateSelection(entry);
    this.show = false;
    this.refTrigger.focus();
  };

  @action
  toggleOpen = () => {
    this.show = !this.show;
  };

  handleMouseDown = e => {
    const { refTrigger, refFlyOut } = this;
    if (!refFlyOut) return;

    const elements = [refTrigger, refFlyOut.DOMNode];

    const hitInsideContainer = elements.some(ele => ele.contains(e.target) || ele === e.target);
    if (hitInsideContainer) return;

    this.close();
  };

  @action
  close() {
    this.show = false;
  }

  handleEnterStart = () => {
    const node = this.refFlyOut.DOMNode;

    if (this.show) {
      this.refFlyOut.DOMNode.focus();
    }

    const ele = node.querySelector('[data-item-selected="true"]');

    if (!ele) return;

    const idx = parseInt(ele.getAttribute('data-idx'), 10);

    this.focusElementByIndex(idx);
  };

  handleRevealerShown = () => {
    const node = this.refFlyOut?.DOMNode;
    node && scrollIntoView(node);

    const { document: doc } = window;
    doc.addEventListener('mousedown', this.handleMouseDown);
  };

  removeCloseListener = () => {
    const { document: doc } = window;
    doc.removeEventListener('mousedown', this.handleMouseDown);
  };

  renderItem = entry => {
    const { renderItem } = this.props;
    if (renderItem) return renderItem(entry);

    return (
      <T.Text noMargin ellipsis className={cx('ListItemText')}>
        {entry.value}
      </T.Text>
    );
  };

  checkBlur = debounce(
    action(() => {
      const { wrapperRef } = this;
      if (!wrapperRef) return;

      const dropdownOrItemHasFocus = wrapperRef.contains(document.activeElement) || wrapperRef === document.activeElement;
      if (dropdownOrItemHasFocus) return;

      const { onBlur } = this.props;
      this.focused = false;
      this.close();
      onBlur && onBlur();
    }),
    150,
  );

  handleKeyDown = e => {
    const isArrowDown = e.key === 'ArrowDown';
    const isArrowUp = e.key === 'ArrowUp';

    if (isArrowDown || isArrowUp) e.preventDefault();

    if (isArrowUp) {
      this.moveToPrevIndex();
    }
    if (isArrowDown) {
      this.moveToNextIndex();
    }

    if (e.key === 'Escape') {
      this.close();
    }
  };

  handleKeyPress = e => {
    if (e.key === 'Enter') {
      const { selectedIndex } = this;
      const item = this.items[selectedIndex];

      if (item) {
        this.updateSelection(item);
      }
    }
  };

  @action
  handleFocus = e => {
    this.focused = true;
    const { onFocus } = this.props;
    onFocus && onFocus(e);
  };

  @action
  moveToPrevIndex() {
    if (this.selectedIndex >= 0) {
      this.selectedIndex--;
    }
  }

  @action
  moveToNextIndex() {
    if (this.selectedIndex < this.items.length - 1) {
      this.selectedIndex++;
    }
  }

  handleKeyDownOnTrigger = e => {
    if (['ArrowDown', 'ArrowUp', 'Enter'].includes(e.key)) this.toggleOpen();
  };

  render() {
    const { show, props, selectedItem } = this;
    const {
      id,
      className,
      wide,
      listClassName,
      listStyle,
      placeholder = '--',
      noItemsText = trans('NO_ITEMS_TO_PICK', 'No items to pick'),
      error,
      big,
      triggerClassName,
      alignRightErrorMsg,
      lighterPlaceholder,
    } = props;

    const showPlaceholder = !selectedItem;

    return (
      <div ref={ref => (this.wrapperRef = ref)} data-c="dropdown" className={cx('Dropdown', { wide, big }, className)} id={id}>
        <div className={cx('reveler-container')}>
          <div
            ref={ref => (this.refTrigger = ref)}
            onBlur={this.checkBlur}
            onFocus={this.handleFocus}
            tabIndex={0}
            className={cx('Trigger', { focused: this.focused, error })}
            onClick={this.toggleOpen}
            onKeyDown={this.handleKeyDownOnTrigger}>
            <div className={cx('Selected')}>
              <div className={cx('ListItem', triggerClassName)}>
                {showPlaceholder && (
                  <T.Text
                    noMargin
                    ellipsis
                    className={cx('ListItemText', { showPlaceholder, lighterPlaceholder })}
                    data-id={`dropdownPlaceholder-${placeholder}`}>
                    {placeholder}
                  </T.Text>
                )}
                {!showPlaceholder && this.renderItem(selectedItem)}
              </div>
            </div>
            <div className={cx('Caret', { show })}>
              <span>{'▴'}</span>
            </div>
          </div>
          <Revealer
            ref={ref => (this.refFlyOut = ref)}
            onBlur={this.checkBlur}
            tabIndex={0}
            onKeyDown={this.handleKeyDown}
            onKeyPress={this.handleKeyPress}
            className={cx('FlyOut')}
            show={show}
            onEnterStart={this.handleEnterStart}
            onEnter={this.handleRevealerShown}
            onExit={this.removeCloseListener}>
            {() => {
              const { items = [] } = this;
              if (items.length === 0) {
                return (
                  <div className={cx('ListItem')}>
                    <T.Text noMargin ellipsis className={cx('ListItemText')}>
                      {noItemsText}
                    </T.Text>
                  </div>
                );
              }
              return (
                <div className={cx('List', listClassName)} style={listStyle} data-id={`dropdownItems-${placeholder}`}>
                  {items.map((entry, idx) => {
                    const selected = entry.id === (selectedItem || {}).id;
                    const focused = idx === this.selectedIndex;
                    return (
                      <div
                        data-idx={idx}
                        key={entry.id}
                        data-id={entry.id}
                        data-value={entry.value}
                        data-item-selected={selected}
                        data-item-focused={focused}
                        className={cx('ListItem')}
                        onClick={() => this.updateSelection(entry)}>
                        {this.renderItem(entry, { selected, focused })}
                      </div>
                    );
                  })}
                </div>
              );
            }}
          </Revealer>
        </div>
        {error && (
          <T.Caption className={cx('error', { alignRightErrorMsg })} error>
            {error}
          </T.Caption>
        )}
      </div>
    );
  }
}
