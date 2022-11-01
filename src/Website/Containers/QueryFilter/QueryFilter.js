/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

import React, { Component } from 'react';
import { observer } from 'mobx-react';
import classNames from 'classnames/bind';
import uniqBy from 'lodash/uniqBy';
import groupBy from 'lodash/groupBy';
import trim from 'jq-trim';
import debounce from 'debouncy';

import { trans } from '../../../common/trans';
import { isEdge, isIE11 } from '../../../common/browserHelper';
import TextBox from '../../../components/TextBox/TextBox';
import List from '../../../components/List/List';
import ListItem from '../../../components/List/ListItem';
import styles from './QueryFilter.scss';
import MainSection from '../../../components/List/MainSection';
import * as T from '../../../components/Typography/Typopgraphy';
import { contains } from '../../../common/dom';

const cx = classNames.bind(styles);

const ARROW_UP_KEY_CODE = 38;
const ARROW_DOWN_KEY_CODE = 40;
const ENTER_KEY_CODE = 13;
const ESCAPE_KEY_CODE = 27;
const THRESHOLD_TO_CLOSE_LIST = 100;

const FocusType = {
  NEXT: 'next',
  PREVIOUS: 'previous',
};

export const SearchCategory = {
  NEIGHBORHOOD: 'neighborhood',
  CITY: 'city',
  STATE: 'state',
  COMMUNITY: 'community',
  REGION: 'region',
};

const SpecialCategory = {
  CROSS_STATES_REGION: 'cross_states_region',
};

const SearchCategoriesTitles = {
  [SearchCategory.NEIGHBORHOOD]: trans('NEIGHBORHOODS', 'NEIGHBORHOODS'),
  [SearchCategory.CITY]: trans('CITIES', 'CITIES'),
  [SearchCategory.STATE]: trans('STATES', 'STATES'),
  [SearchCategory.COMMUNITY]: trans('COMMUNITIES', 'COMMUNITIES'),
  [SearchCategory.REGION]: trans('REGIONS', 'REGIONS'),
};

const doesMatch = (word, { name, aliases = [] }) => {
  if (!Array.isArray(aliases)) {
    aliases = [aliases];
  }
  return (
    name.toLowerCase().includes(word) ||
    (aliases || [])
      .join(' ')
      .toLowerCase()
      .includes(word)
  );
};

const getCrossStatesRegions = ({ matchingProperties, properties, currentProperty }) => {
  const propertyObjects = matchingProperties.map(({ propertyId }) => properties.find(p => p.propertyId === propertyId));
  const propertiesGroupedByRegion = groupBy(propertyObjects, ({ region }) => region);

  const crossStatesRegions = propertyObjects.reduce((acc, property) => {
    const { region } = property;
    const propertiesGroupedByCurrentRegion = propertiesGroupedByRegion[region];
    if (currentProperty.region !== region || propertiesGroupedByCurrentRegion.length === 1) return acc;

    acc.push(...propertiesGroupedByCurrentRegion);
    return acc;
  }, []);

  return uniqBy(crossStatesRegions, 'state');
};

const matchingRules = [
  (word, { neighborhood, neighborhoodAliases }) =>
    doesMatch(word, { name: neighborhood, aliases: neighborhoodAliases }) ? SearchCategory.NEIGHBORHOOD : false,
  (word, { city, cityAliases }) => (doesMatch(word, { name: city, aliases: cityAliases }) ? SearchCategory.CITY : false),
  (word, { state, stateAliases }) => (doesMatch(word, { name: state, aliases: stateAliases }) ? SearchCategory.STATE : false),
  (word, { displayName }) => (doesMatch(word, { name: displayName }) ? SearchCategory.COMMUNITY : false),
  (word, { region, regionAliases }) => (doesMatch(word, { name: region, aliases: regionAliases }) ? SearchCategory.REGION : false),
];

const specialCategoriesRules = {
  [SearchCategory.REGION]: ({ matchingProperties, properties, currentProperty }) =>
    getCrossStatesRegions({ matchingProperties, properties, currentProperty }).length > 1 ? SpecialCategory.CROSS_STATES_REGION : null,
};

const formattingRules = {
  [SearchCategory.NEIGHBORHOOD]: ({ neighborhood, city, state }) => ({ label: `${neighborhood}, ${city}, ${state}`, query: { neighborhood, city, state } }),
  [SearchCategory.CITY]: ({ city, state }) => ({ label: `${city}, ${state}`, query: { city, state } }),
  [SearchCategory.STATE]: ({ state }) => ({ label: state, query: { state } }),
  [SearchCategory.COMMUNITY]: ({ propertyId, displayName, city, state }) => ({ label: `${displayName}, ${city}, ${state}`, query: { propertyId } }),
  [SearchCategory.REGION]: ({ region, state }) => ({ label: `${region}, ${state}`, query: { region } }),
  [SpecialCategory.CROSS_STATES_REGION]: ({ region, matchingProperties, properties }) => {
    const crossStatesRegions = getCrossStatesRegions({ matchingProperties, properties, currentProperty: { region } });
    const formattedStates = crossStatesRegions.map(({ state }) => state).join(' / ');
    return { label: `${region}, ${formattedStates}`, query: { region } };
  },
};

const searchMatchingProperties = (properties, word) =>
  properties.reduce((acc, property) => {
    const { propertyId } = property;
    const matchingCategories = matchingRules.reduce((matches, rule) => {
      const match = rule(word, property);
      if (!match) return matches;

      matches.push(match);
      return matches;
    }, []);
    if (!matchingCategories.length) return acc;

    acc.push({ propertyId, matches: matchingCategories });
    return acc;
  }, []);

const formatResultsByCategory = (matchingProperties, properties, category) =>
  matchingProperties.reduce((list, matchingProperty) => {
    const { propertyId, matches } = matchingProperty;
    if (!matches.includes(category) || list.length >= 5) return list;

    const property = properties.find(p => p.propertyId === propertyId);

    const applySpecialRule = specialCategoriesRules[category];
    const specialCategory = applySpecialRule ? applySpecialRule({ matchingProperties, properties, currentProperty: property }) : null;

    const format = formattingRules[specialCategory || category];
    list.push(format({ ...property, matchingProperties, properties }));

    return list;
  }, []);

const search = (properties, word, categories) => {
  const matchingProperties = searchMatchingProperties(properties, word);

  let hasResults = false;

  const searchResults = Object.keys(SearchCategory).reduce((acc, key) => {
    const category = SearchCategory[key];
    if (categories.length && !categories.some(it => it === category)) return acc;

    const formattedResults = formatResultsByCategory(matchingProperties, properties, category);
    if (formattedResults.length) {
      hasResults = true;
    } else {
      return acc;
    }

    acc[category] = uniqBy(formattedResults, 'label');
    return acc;
  }, {});
  return hasResults ? searchResults : null;
};

@observer
export default class QueryFilter extends Component {
  state = {};

  constructor(props) {
    super(props);
    const { selectedItem = {} } = props;

    this.state = {
      selectedItem,
      value: selectedItem.label,
      shouldScrollWhenFocused: this.shouldScrollWhenFocused(),
    };
  }

  componentDidUpdate(prevProps) {
    const { selectedItem } = this.props;
    if (prevProps.selectedItem !== selectedItem) {
      this.setState({ selectedItem, value: selectedItem.label, focused: false, focusedItem: null }); // eslint-disable-line react/no-did-update-set-state
    }
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside);
  }

  onItemClick = item => {
    this.setState({ selectedItem: item, value: item.label, focused: false, focusedItem: null });

    const { onItemClick } = this.props;
    onItemClick && onItemClick(item);
  };

  shouldScrollWhenFocused = () => !(isEdge || isIE11);

  renderGroupSection = (categoryName, items) => {
    const { selectedItem, shouldScrollWhenFocused } = this.state;
    return (
      <MainSection key={categoryName}>
        <ListItem clickable={false} hoverable={false} className={cx('group-section')}>
          {SearchCategoriesTitles[categoryName]}
        </ListItem>
        {items.map(item => (
          <ListItem
            tabIndex={0}
            key={item.label}
            scrollWhenFocused={shouldScrollWhenFocused}
            selected={selectedItem && selectedItem.label === item.label}
            focused={item.focused}
            className={cx('result-item')}
            onClick={() => this.onItemClick(item)}>
            {item.label}
          </ListItem>
        ))}
      </MainSection>
    );
  };

  renderCategorySections = searchResults => Object.keys(searchResults).map(categoryName => this.renderGroupSection(categoryName, searchResults[categoryName]));

  clearItemsFocus = () => {
    const { searchResults } = this.state;
    return Object.keys(searchResults).reduce(
      (acc, key) => {
        acc[key] = acc[key].map(x => ({ ...x, focused: false }));
        return acc;
      },
      { ...searchResults },
    );
  };

  setFocusedItem = focusType => {
    const { focusedItem, searchResults } = this.state;

    const categories = Object.keys(searchResults);
    let newSearchResults = { ...searchResults };

    const { index: currentIndex } = focusedItem || {};

    const { noMoreCategoriesLeft, focusedCategoryKey, focusedCategoryIndex, categoryChanged, shouldFocusFirstItem, focusedListItem, nothingFocused } =
      focusType === FocusType.NEXT
        ? this.getNextFocusedCategory({ focusedItem, newSearchResults, categories })
        : this.getPreviousFocusedCategory({ focusedItem, categories });

    if (noMoreCategoriesLeft || nothingFocused) return null;

    if (shouldFocusFirstItem) {
      const focusedCategoryItems = newSearchResults[focusedCategoryKey];
      focusedCategoryItems[0] = { ...focusedCategoryItems[0], focused: true };
      newSearchResults[focusedCategoryKey] = focusedCategoryItems;

      return this.setState({
        focusedItem: { ...focusedListItem, item: focusedCategoryItems[0] },
        searchResults: newSearchResults,
      });
    }

    newSearchResults = this.clearItemsFocus();

    const { index, focusedCategoryItems } =
      focusType === FocusType.NEXT
        ? this.setNextFocusedItem({ categoryChanged, focusedItem, newSearchResults, focusedCategoryKey })
        : this.setPreviousFocusedItem({ categoryChanged, focusedItem, newSearchResults, focusedCategoryKey, currentIndex });

    return this.setState({
      searchResults: newSearchResults,
      focusedItem: { index, categoryKey: focusedCategoryKey, categoryIndex: focusedCategoryIndex, item: focusedCategoryItems[index] },
    });
  };

  setNextFocusedItem = ({ categoryChanged, focusedItem, newSearchResults, focusedCategoryKey }) => {
    const index = categoryChanged ? 0 : focusedItem.index + 1;

    const focusedCategoryItems = newSearchResults[focusedCategoryKey];
    focusedCategoryItems[index] = { ...focusedCategoryItems[index], focused: true };
    newSearchResults[focusedCategoryKey] = focusedCategoryItems;

    return { index, focusedCategoryItems };
  };

  setPreviousFocusedItem = ({ categoryChanged, newSearchResults, focusedCategoryKey, currentIndex }) => {
    const focusedCategoryItems = newSearchResults[focusedCategoryKey];
    const index = categoryChanged ? focusedCategoryItems.length - 1 : currentIndex - 1;

    focusedCategoryItems[index] = { ...focusedCategoryItems[index], focused: true };
    newSearchResults[focusedCategoryKey] = focusedCategoryItems;

    return { index, focusedCategoryItems };
  };

  getNextFocusedCategory = ({ focusedItem, newSearchResults, categories }) => {
    if (!focusedItem) {
      return {
        focusedCategoryKey: categories[0],
        shouldFocusFirstItem: true,
        focusedListItem: { index: 0, categoryKey: categories[0], categoryIndex: 0 },
      };
    }

    const { categoryIndex } = focusedItem;

    if (focusedItem.index + 1 > newSearchResults[focusedItem.categoryKey].length - 1) {
      if (categoryIndex + 1 > categories.length - 1) return { noMoreCategoriesLeft: true };

      const focusedCategoryIndex = categoryIndex + 1;
      return {
        focusedCategoryIndex,
        focusedCategoryKey: categories[focusedCategoryIndex],
        categoryChanged: true,
      };
    }

    return {
      focusedCategoryKey: focusedItem.categoryKey,
      focusedCategoryIndex: categoryIndex,
    };
  };

  getPreviousFocusedCategory = ({ focusedItem, categories }) => {
    if (!focusedItem) return { nothingFocused: true };

    const { categoryIndex, index: currentIndex } = focusedItem;

    if (currentIndex === 0) {
      if (categoryIndex - 1 < 0) return { noMoreCategoriesLeft: true };

      const focusedCategoryIndex = categoryIndex - 1;
      return {
        focusedCategoryIndex,
        focusedCategoryKey: categories[focusedCategoryIndex],
        categoryChanged: true,
      };
    }

    return {
      focusedCategoryKey: focusedItem.categoryKey,
      focusedCategoryIndex: categoryIndex,
    };
  };

  search = value => {
    this.setState({ focused: true, focusedItem: null });

    if (!value || value.length < 2) {
      return this.setState({
        searchResults: null,
      });
    }

    this.setState({ value });

    const { properties, categories = [] } = this.props;
    if (!properties) return null;

    const words = value.split(',');
    const results = words.filter(w => w && w.trim()).reduce((acc, word) => ({ ...acc, ...search(properties, word.toLowerCase(), categories) }), {});

    if (Object.entries(results).length === 0) return this.setState({ noMatchFound: true, searchResults: null });

    return this.setState({ searchResults: results, noMatchFound: false });
  };

  handleKeyUp = e => {
    const { searchResults, focusedItem, selectedItem } = this.state;

    const value = e.target.value;
    if (searchResults) {
      const { keyCode } = e;
      if (keyCode === ARROW_DOWN_KEY_CODE || (keyCode === ENTER_KEY_CODE && !focusedItem)) {
        return this.setFocusedItem(FocusType.NEXT);
      }
      if (keyCode === ARROW_UP_KEY_CODE) {
        return this.setFocusedItem(FocusType.PREVIOUS);
      }
      if (keyCode === ENTER_KEY_CODE && focusedItem) {
        return this.onItemClick(focusedItem.item);
      }
      if (keyCode === ESCAPE_KEY_CODE) {
        return this.setState({
          value: (selectedItem && selectedItem.label) || value,
          selectedItem: selectedItem || null,
          searchResults: null,
          noMatchFound: false,
          focusedItem: null,
        });
      }
    }

    return this.search(trim(value));
  };

  onTextBoxChange = ({ value }) => {
    const { onClear, onChange } = this.props;
    onChange && onChange({ value: value && !this.state.noMatchFound ? this.state.selectedItem : null });
    if (value) return;
    this.setState({
      value: '',
      selectedItem: null,
      searchResults: null,
      noMatchFound: false,
      focusedItem: null,
    });
    onClear && onClear();
  };

  handleClickOutside = event => {
    if (!this.wrapperRef) return;
    const domNode = this.wrapperRef;

    if (domNode && !domNode.contains(event.target)) {
      const { selectedItem } = this.state;

      if (!selectedItem) return;
      this.setState({ value: selectedItem.label, focused: false, focusedItem: null });
    }
  };

  handleFocus = event => event.target.select();

  setWrapperRef = node => {
    this.wrapperRef = node;
  };

  renderIconAffordance = () => (
    <svg viewBox="0 0 24 24">
      <path d="M9.5,3C13.1,3,16,5.9,16,9.5c0,1.6-0.6,3.1-1.6,4.2l0.3,0.3h0.8l5,5L19,20.5l-5-5v-0.8l-0.3-0.3c-1.1,1-2.6,1.6-4.2,1.6C5.9,16,3,13.1,3,9.5C3,5.9,5.9,3,9.5,3z M9.5,5C7,5,5,7,5,9.5C5,12,7,14,9.5,14C12,14,14,12,14,9.5C14,7,12,5,9.5,5z" />
    </svg>
  );

  closeList = debounce(() => {
    if (!this.state.focused || contains(this.wrapperRef, document.activeElement)) return;
    this.setState({ focused: false });
  }, THRESHOLD_TO_CLOSE_LIST);

  render() {
    const { customPlaceholder, error, customNoMatchFoundText, inputClassName, alignRightErrorMsg, autoFocus } = this.props;
    const { listDimensions, searchResults, selectedItem, value, focused, noMatchFound } = this.state;

    return (
      <div data-component="query-filter" className={cx('queryFilter')} ref={this.setWrapperRef} onBlur={this.closeList}>
        <TextBox
          className={cx('textbox', { selected: !!selectedItem, error })}
          inputClassName={inputClassName}
          wrapperClassName={cx('textboxWrapper')}
          placeholder={customPlaceholder || trans('BOOK_A_TOUR', 'Search by City, State, Region or Community Name')}
          iconAffordance={this.renderIconAffordance()}
          showClear={true}
          autoComplete="none"
          onChange={this.onTextBoxChange}
          value={value || ((selectedItem && selectedItem.label) || '')}
          onKeyUp={this.handleKeyUp}
          onFocus={this.handleFocus}
          tabIndex={0}
          wide
          autoFocus={autoFocus}
        />
        {searchResults && focused && (
          <List style={listDimensions} className={cx('results')}>
            {this.renderCategorySections(searchResults)}
          </List>
        )}
        {focused && noMatchFound && (
          <List style={listDimensions} className={cx('results')}>
            <div className={cx('no-results')}>
              {customNoMatchFoundText || (
                <T.Caption raw secondary>
                  {('NO_MATCH_FOUND', 'No match found. To view a list of cities, please see the bottom of this page')}
                </T.Caption>
              )}
            </div>
          </List>
        )}
        {error && (
          <T.Caption className={cx('error', { alignRightErrorMsg })} error>
            {error}
          </T.Caption>
        )}
      </div>
    );
  }
}
