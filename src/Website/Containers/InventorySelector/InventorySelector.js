/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

import React, { Component } from 'react';
import { observer, inject, Observer } from 'mobx-react';
import { action, computed, reaction, observable } from 'mobx';
import classNames from 'classnames/bind';
import { trans } from '../../../common/trans';
import LoadingBlock from '../../../components/LoadingBar/LoadingBlock';
import SelectionGroup from '../../../components/SelectionGroup/SelectionGroup';
import DateSelector from '../../../components/DateSelector/DateSelector';
import Button from '../../../components/Button/Button';
import Picture from '../../../components/Picture/Picture';
import SizeAware from '../../../components/SizeAware/SizeAware';
import * as T from '../../../components/Typography/Typopgraphy';
import styles from './InventorySelector.scss';
import { getLayoutImage } from '../../helpers/images';
import UnitTypeBlock from './UnitTypeBlock';

import { DialogModel } from '../../../common/DialogModel';

import InventoryDialog, { dialogPages } from '../InventoryDialog/InventoryDialog';
import { combineWithParams } from '../../../common/serialize';
import { defaultBreakpointsAsArray } from '../../../components/SizeAware/Breakpoints';
import { Events, Categories, Components, SubContexts } from '../../helpers/tracking-helper';

const cx = classNames.bind(styles);

@inject('webSiteStore')
@observer
export default class InventorySelector extends Component {
  dlg = new DialogModel();

  /* We only handle 2 layout sizes
   * true: bigger than xsmall2
   * false: smaller than xsmall2
   */
  layoutDefaultDimensions = {
    true: { width: 307, height: 660 },
    false: { width: 432, height: 293 },
  };

  componentDidMount() {
    this.trackIfInventoryModalShouldBeOpened();
    this.startSyncingQueryParams();
  }

  @observable
  inventoryDialogProps = {};

  trackIfInventoryModalShouldBeOpened = () => {
    this.stopReaction = reaction(
      () => ({
        // this is the proper fix. Since the object was dereferenced above
        // the reaction was not able to track it
        selectedInventoryId: this.layoutStore?.selectedInventoryId,
      }),
      ({ selectedInventoryId }) => {
        const { dlg } = this;
        // check if we need to open or close it if we have a selectedInventoryId
        if (selectedInventoryId) {
          this.inventoryDialogProps = { inventoryId: this.layoutStore?.selectedInventoryId };
          dlg.open();
        } else {
          dlg.close();
        }
      },
    );
  };

  startSyncingQueryParams = () => {
    // this reaction will wait for the layoutStore to be defined
    // once it is defined we restore the parameters from the query params
    // and stop listening for changes because this is just for the first time
    this.layoutStoreStopReaction = reaction(
      () => ({ layoutStore: this.layoutStore }),
      ({ layoutStore: ls }) => {
        if (ls) {
          ls.restoreFromQueryParams();
          this.layoutStoreStopReaction();
        }
      },
    );

    // in case the layoutStore is already defined we don't need to
    // wait for the reaction to kick in and we can stop the reaction
    const { layoutStore } = this;
    if (layoutStore) {
      layoutStore.restoreFromQueryParams();
      this.layoutStoreStopReaction();
    }

    // this reaction will track the changes on the paramsForQueryString computed
    // property which contains the state needed to know if we have to open a given
    // marketing layout or if we have to open an inventory dialog for a unit
    this.qparamsReaction = reaction(
      () => {
        const { paramsForQueryString } = this.layoutStore || {};
        return { paramsForQueryString };
      },
      ({ paramsForQueryString }) => {
        const { history, location } = window;
        history.replaceState(
          {},
          '',
          combineWithParams(location.href, paramsForQueryString, {
            processOriginalQueryParams: qparams => {
              const { inventoryId, mktLayoutGroupId, ...rest } = qparams;
              return rest;
            },
          }),
        );
      },
    );
  };

  stopSyncingQueryParams = () => {
    const { qparamsReaction } = this;
    qparamsReaction && qparamsReaction();
  };

  componentWillUnmount() {
    this.stopReaction && this.stopReaction();
    this.stopSyncingQueryParams();
  }

  @computed
  get propertyStore() {
    const { webSiteStore } = this.props;
    const { currentPropertyStore = {} } = webSiteStore;
    return currentPropertyStore;
  }

  @computed
  get layoutStore() {
    const { webSiteStore } = this.props;
    const { currentPropertyStore = {} } = webSiteStore;
    return currentPropertyStore?.layoutStore;
  }

  handleOnMoveInDateChange = value => {
    const { webSiteStore } = this.props;
    webSiteStore?.setMoveInDate(value);

    const date = value && value.toJSON() ? value.toJSON() : '';

    webSiteStore.notifyEvent(Events.MOVE_IN_DATE_SET, {
      date,
      eventLabel: date,
      layoutGroupId: this.selectedMarketingLayoutGroup?.id,
      layoutGroupName: this.selectedMarketingLayoutGroup?.name,
      category: Categories.SALES,
      component: Components.INVENTORY_SELECTOR,
      subContext: SubContexts.MOVE_IN_DATE,
    });
  };

  @computed
  get selectedMarketingLayoutGroup() {
    const [mktLayoutGroupId] = this.layoutStore.selectedMarketingLayoutGroupId || [];
    return this.propertyStore.marketingLayoutGroups.find(g => g.id === mktLayoutGroupId);
  }

  handleOnLayoutGroupChange = ({ ids }) => {
    const { webSiteStore } = this.props;
    const { layoutStore } = this.propertyStore;
    layoutStore?.setSelectedMarketingLayoutGroup(ids);

    const { selectedMarketingLayoutGroup: selectedMktLytGr } = this;

    webSiteStore.notifyEvent(Events.LAYOUT_GROUP_SELECTED, {
      layoutGroupId: selectedMktLytGr?.id,
      layoutGroupName: selectedMktLytGr?.name,
      eventLabel: `${selectedMktLytGr?.id}-${selectedMktLytGr?.name}`,
      category: Categories.SALES,
      component: Components.InventorySelector,
    });
  };

  renderMoveInDate = () => {
    const { timezone } = this.propertyStore;
    const { webSiteStore } = this.props;

    const { moveInDate, minMoveInDate } = webSiteStore;

    return (
      <div className={cx('moveInDate')} data-id="inventoryDateSelector">
        <T.Caption>{trans('PLAN_TO_MOVE_IN', 'When do you plan to move in?')}</T.Caption>
        <DateSelector wide tz={timezone} onChange={this.handleOnMoveInDateChange} selectedDate={moveInDate} min={minMoveInDate} />
      </div>
    );
  };

  renderLayoutGroupOption = ({ id, text, originalItem }, selectItem, layoutDimensions) => {
    const { layoutStore = {} } = this.propertyStore;
    const { shouldDisplayUnits, selectedMarketingLayoutGroupId = [] } = layoutStore;

    const renderTestimonial = () => (
      <div className={cx('testimonial')}>
        <T.Header className={cx('description')} data-id="testimonialText">
          {trans('EXPLORE_UNIT_TYPE', `Explore ${originalItem.displayName}`, {
            unitType: originalItem.displayName,
          })}
        </T.Header>
      </div>
    );

    const isButtonSelected = selectedMarketingLayoutGroupId.some(it => it === id);
    const shouldDisplayChevron = isButtonSelected;

    return (
      <div data-component="group-layout-selector" className={cx('layoutContainer')} onClick={selectItem}>
        <Button
          type={isButtonSelected ? 'raised' : 'flat'}
          btnRole={isButtonSelected ? 'primary' : 'secondary'}
          data-selected={isButtonSelected}
          className={cx('button', {
            selected: isButtonSelected,
            'chevron-arrow-bottom': shouldDisplayChevron,
          })}
          wide
          label={text}
        />
        {!shouldDisplayUnits && (
          <div className={cx('imageContainer')} data-id="layoutImageContainer">
            <Picture
              src={getLayoutImage(originalItem.imageUrl, layoutDimensions)}
              className={cx('image')}
              backgroundSize={'cover'}
              caption={() => renderTestimonial()}
              lazy={true}
            />
          </div>
        )}
      </div>
    );
  };

  @action
  handleTourOpen = () => {
    this.inventoryDialogProps = { openAtPage: dialogPages.BOOK_APPOINTMENT_PAGE, hideBackButton: true, inventoryId: null };
    this.dlg.open();
  };

  renderUnits = ({ selectedLayouts, loading }, matches, enableScheduleTour, enableHeroListingHighlight) => (
    <div className={cx('unitTypeSelected')} data-id="unitsContainer">
      {loading && <LoadingBlock height={500} />}
      {!loading &&
        selectedLayouts.map(unit => (
          <UnitTypeBlock
            key={unit.marketingLayoutId}
            unit={unit}
            matches={matches}
            onTourDialogOpen={this.handleTourOpen}
            enableScheduleTour={enableScheduleTour}
            enableHeroListingHighlight={enableHeroListingHighlight}
          />
        ))}
    </div>
  );

  renderLayoutGroups = matches => {
    const { marketingLayoutGroups = [], layoutStore = {} } = this.propertyStore;
    const layoutDimensions = this.layoutDefaultDimensions[matches.xsmall2];

    return (
      <div className={cx('unitTypesBlocks')} data-id="marketingLayoutGroups">
        <SelectionGroup
          items={marketingLayoutGroups}
          onChange={this.handleOnLayoutGroupChange}
          textField="displayName"
          valueField="id"
          value={layoutStore.selectedMarketingLayoutGroupId}
          className={cx('layoutGroups', {
            'no-images': layoutStore.shouldDisplayUnits,
            'three-cards': marketingLayoutGroups.length === 3,
            'two-cards': marketingLayoutGroups.length === 2,
            'one-card': marketingLayoutGroups.length === 1,
          })}
          itemTemplate={(item, { selectItem }) => this.renderLayoutGroupOption(item, selectItem, layoutDimensions)}
          type="radio"
        />
      </div>
    );
  };

  @action
  handleCloseRequest = () => {
    const { dlg } = this;
    dlg.close();
    this.inventoryDialogProps = {};
    const { layoutStore } = this;
    layoutStore.clearSelectedInventoryId();
  };

  @action
  handleClosed = args => {
    const { dialogHasError } = args || {};
    const { layoutStore } = this;

    if (dialogHasError) {
      layoutStore.reloadInventoryInfoIfNeeded();
    }
  };

  render() {
    const { marketingLayoutGroups = [], loaded: propertyLoaded, property } = this.propertyStore;
    const shouldDisplayLayoutGroups = marketingLayoutGroups.length > 1 && propertyLoaded;
    const { dlg, layoutStore, inventoryDialogProps } = this;
    const { enableScheduleTour, selfServeAllowExpandLeaseLengthsForUnits, enableHeroListingHighlight } = property || {};
    return (
      <SizeAware breakpoints={defaultBreakpointsAsArray}>
        {({ matches }) => (
          <div className={cx('inventorySelector', { ...matches })}>
            {!propertyLoaded && <LoadingBlock height={500} />}
            {propertyLoaded && this.renderMoveInDate()}
            {shouldDisplayLayoutGroups && this.renderLayoutGroups(matches)}
            {propertyLoaded && layoutStore?.shouldDisplayUnits && this.renderUnits(layoutStore, matches, enableScheduleTour, enableHeroListingHighlight)}
            <Observer>
              {() => (
                <InventoryDialog
                  {...inventoryDialogProps}
                  onClosed={this.handleClosed}
                  isOpen={dlg.isOpen}
                  onCloseRequest={this.handleCloseRequest}
                  enableScheduleTour={enableScheduleTour}
                  selfServeAllowExpandLeaseLengthsForUnits={selfServeAllowExpandLeaseLengthsForUnits}
                />
              )}
            </Observer>
          </div>
        )}
      </SizeAware>
    );
  }
}
