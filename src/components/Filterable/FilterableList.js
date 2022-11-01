/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

import React, { Component } from 'react';
import debounce from 'debouncy';
import { observable, action, reaction } from 'mobx';
import { observer, Observer } from 'mobx-react';
import classNames from 'classnames/bind';

import scrollIntoView from '../../common/scrollIntoView';
import * as T from '../Typography/Typopgraphy';
import TextBox from '../TextBox/TextBox';
import { trans } from '../../common/trans';
import styles from './FilterableList.scss';
import FilterableModel from '../../Models/FilterableModel';
import Scrollable from '../Scrollable/Scrollable';
import ListItem from '../List/ListItem';
import MainSection from '../List/MainSection';
import List from '../List/List';

const cx = classNames.bind(styles);

@observer
export default class FilterableList extends Component {
  @observable
  query;

  @observable
  selectedIndex = -1;

  constructor(props) {
    super(props);

    const { items, filterFn, selectedIds } = props;

    const model = (this.model = new FilterableModel({
      items,
      filterFn,
    }));

    model.setSelectedIds(selectedIds);

    reaction(() => this.selectedIndex, () => this.scrollFocusedElementIntoViewport(this.selectedIndex));
    reaction(() => model.filteredElements, () => this.refreshScrollable());

    this.model = model;
  }

  focus() {
    if (this.filterRef) {
      this.filterRef.focusInput();
    }
  }

  @action
  componentDidUpdate(prevProps) {
    const { model, props: nextProps } = this;

    if (nextProps.items !== prevProps.items) {
      model.setItems(nextProps.items);
    }

    if (nextProps.filterFn !== prevProps.filterFn) {
      model.setFilterFn(nextProps.filterFn);
    }

    if (nextProps.selectedIds !== prevProps.selectedIds) {
      if (nextProps.selectedIds !== model.selected.ids) {
        console.log('performing the change');
        model.setSelectedIds(nextProps.selectedIds);
      }
    }
  }

  refreshScrollable = debounce(() => {
    this.scrollableRef && this.scrollableRef.updateScrollProps();
  }, 100);

  scrollFocusedElementIntoViewport = () => {
    if (this.selectedIndex > -1 && this.listRef) {
      const node = this.listRef.DOMNode;
      const ele = node.querySelector(`[data-idx="${this.selectedIndex}"]`);
      scrollIntoView(ele);
    }
  };

  @action
  handleQueryChange = ({ value }) => {
    this.query = value;
    this.performSearch();
    this.selectedIndex = -1;
  };

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
  };

  handleKeyPress = e => {
    if (e.key === 'Enter') {
      const { model, selectedIndex } = this;
      const item = model.filteredElements[selectedIndex];

      if (item) {
        this.selectItem(item);
      }
    }
  };

  @action
  moveToPrevIndex() {
    if (this.selectedIndex >= 0) {
      this.selectedIndex--;
    }
  }

  @action
  moveToNextIndex() {
    const { model } = this;

    if (this.selectedIndex < model.filteredElements.length - 1) {
      this.selectedIndex++;
    }
  }

  performSearch = debounce(() => {
    const { model } = this;
    model.setQuery(this.query);
  }, 300);

  @action
  selectItem = item => {
    const { model, props } = this;
    const { onItemSelect, onChange } = props;
    const args = { model };

    onItemSelect && onItemSelect(item, args);

    if (args.cancel) return;

    const hasChanged = model.select(item);

    if (hasChanged) {
      onChange && onChange(item);
    }
  };

  renderItem = (item, args) => {
    const { renderItem } = this.props;

    if (renderItem) {
      return renderItem(item, args);
    }

    return (
      <ListItem focused={args.focused} selected={args.selected}>
        <MainSection className={cx('item-text-container')}>
          <T.Text lighterForeground={args.selected} className={cx('item-text')}>
            {item.text}
          </T.Text>
        </MainSection>
      </ListItem>
    );
  };

  renderNoItems = () => {
    const { noItemsText = trans('NO_ITEMS_TO_SELECT', 'No items to select'), noItemsTemplate } = this.props;

    if (noItemsTemplate) {
      return noItemsTemplate();
    }

    return (
      <ListItem>
        <MainSection>
          <T.Text>{noItemsText}</T.Text>
        </MainSection>
      </ListItem>
    );
  };

  @action
  focusElementByIndex = idx => {
    this.selectedIndex = idx;
  };

  componentDidMount() {
    const node = this.listRef.DOMNode;
    const ele = node.querySelector('[data-item-selected="true"]');

    if (!ele) return;

    const idx = parseInt(ele.getAttribute('data-idx'), 10);

    this.focusElementByIndex(idx);
  }

  renderNoMatches = () => {
    const { noMatchesText = trans('NO_MATCHES_FOUND', 'No matches found'), noMatchesTemplate } = this.props;

    if (noMatchesTemplate) {
      return noMatchesTemplate();
    }

    return (
      <ListItem>
        <MainSection>
          <T.Text className={cx('no-match-text')}>{noMatchesText}</T.Text>
        </MainSection>
      </ListItem>
    );
  };

  storeScrollableRef = ref => (this.scrollableRef = ref);

  storeListRef = ref => (this.listRef = ref);

  storeFilterRef = ref => (this.filterRef = ref);

  renderIconAffordance = () => (
    <svg>
      <path
        style={{ fill: 'rgba(0, 0, 0, 0.54)' }}
        d="M9.5,3C13.1,3,16,5.9,16,9.5c0,1.6-0.6,3.1-1.6,4.2l0.3,0.3h0.8l5,5L19,20.5l-5-5v-0.8l-0.3-0.3c-1.1,1-2.6,1.6-4.2,1.6C5.9,16,3,13.1,3,9.5C3,5.9,5.9,3,9.5,3z M9.5,5C7,5,5,7,5,9.5C5,12,7,14,9.5,14C12,14,14,12,14,9.5C14,7,12,5,9.5,5z"
      />
    </svg>
  );

  render() {
    const { model, props } = this;
    const { listClassName, id: cId, wide, listHeight } = props;

    return (
      <div className={cx('filterableList', { wide })} id={cId}>
        <Observer>
          {() => (
            <div className={cx('filter')}>
              <TextBox
                iconAffordance={this.renderIconAffordance()}
                iconOnLeft
                fixedIconAffordance
                wide
                ref={this.storeFilterRef}
                onKeyPress={this.handleKeyPress}
                onKeyDown={this.handleKeyDown}
                value={this.query}
                border={false}
                onChange={this.handleQueryChange}
              />
            </div>
          )}
        </Observer>
        <Scrollable height={listHeight} className={cx('scrollableArea', listClassName)} ref={this.storeScrollableRef}>
          <Observer>
            {() => (
              <List onKeyDown={this.handleKeyDown} onKeyPress={this.handleKeyPress} tabIndex={0} ref={this.storeListRef}>
                {model.items.length === 0 && this.renderNoItems()}
                {model.items.length > 0 && model.filteredElements.length === 0 && this.renderNoMatches()}
                {model.filteredElements.map((item, idx) => {
                  const { id } = model.getIdAndText(item);
                  const disabled = model.itemIsDisabled(item);
                  const selectItem = () => !disabled && this.selectItem(item);
                  const selected = model.itemIsSelected(item);

                  return (
                    <div data-idx={idx} key={id} data-item-selected={selected} onClick={selectItem}>
                      {this.renderItem(item, { focused: idx === this.selectedIndex, selected })}
                    </div>
                  );
                })}
              </List>
            )}
          </Observer>
        </Scrollable>
      </div>
    );
  }
}
