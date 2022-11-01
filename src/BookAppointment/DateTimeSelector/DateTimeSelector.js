/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

import React, { Component } from 'react';
import { observer, Observer, inject } from 'mobx-react';
import { action, reaction, observable, computed } from 'mobx';
import classnames from 'classnames/bind';
import debounce from 'debouncy';

import * as T from '../../components/Typography/Typopgraphy';

import ChevronLeft from '../resources/chevron-left.svg';
import ChevronRight from '../resources/chevron-right.svg';
import styles from './DateTimeSelector.scss';
import DateSlot from '../DateSlot/DateSlot';
import { trans } from '../../common/trans';
import SimpleDialog from '../../components/SimpleDialog/SimpleDialog';
import AppointmentButton from '../AppointmentButton/AppointmentButton';
import LoadingBlock from '../../components/LoadingBar/LoadingBlock';
import ErrorBlock from '../../components/ErrorBlock/ErrorBlock';
import { raf } from '../../common/raf';
import { Scroller } from '../../common/scroller';
import { toMoment } from '../../common/moment-utils';
import nullish from '../../common/nullish';

const DEFAULT_SLOT_WIDTH = 123;
const ARROW_WIDTH = 37;

const cx = classnames.bind(styles);

const ArrowBlock = ({ children, disabled, onClick }) => (
  <div className={cx('arrow', { disabled })} onClick={onClick}>
    <div>
      <div className={cx('inner')}>{children}</div>
    </div>
  </div>
);

@inject(({ dtSelectorModel, selfServeModel, timezoneModel }) => ({
  selfServeModel,
  dtSelectorModel,
  timezoneModel,
}))
@observer
export default class DateTimeSelector extends Component {
  constructor(props) {
    super(props);
    const { dtSelectorModel } = this.props;
    dtSelectorModel.fetchSlots();
  }

  @observable
  offset;

  @computed
  get slotWidth() {
    const { widgetDimensions } = this.props.selfServeModel;
    if (!widgetDimensions || nullish(widgetDimensions.width)) return DEFAULT_SLOT_WIDTH;
    const { scrollerWidth } = this;
    const width = Math.floor(scrollerWidth / Math.floor(scrollerWidth / DEFAULT_SLOT_WIDTH));

    return width;
  }

  @computed
  get scrollerWidth() {
    const { widgetDimensions } = this.props.selfServeModel;
    if (!widgetDimensions || nullish(widgetDimensions.width)) return DEFAULT_SLOT_WIDTH * 7;
    const arrowsWidth = ARROW_WIDTH * 2;
    return widgetDimensions.width - arrowsWidth;
  }

  @computed
  get noOfDays() {
    const { scrollerWidth, slotWidth } = this;
    return Math.round(scrollerWidth / slotWidth) * 2;
  }

  handleViewMore = day => {
    const { dtSelectorModel } = this.props;
    dtSelectorModel.openDialog(day);
  };

  handleDateTimeClick = dateAndTime => {
    const { onSelect } = this.props;
    onSelect && onSelect(dateAndTime);
  };

  renderMonth(group) {
    const arr = Array.from(group.entries.values());
    if (arr.length === 0) return null;
    return (
      <div className={cx('month')} key={group.id}>
        <div className={cx('dateAndMonth')} data-id="dateSelectorMonth">
          {<T.Text>{arr[0].date.format('MMMM YYYY')}</T.Text>}
        </div>
        <div className={cx('monthGroup')} data-id="dateSelectorMonthGroup">
          {arr.map(date => this.renderDay(date))}
        </div>
      </div>
    );
  }

  renderDay(day) {
    const { slotWidth } = this;

    const { dtSelectorModel, useCustomizedStyle } = this.props;
    const { startDate } = dtSelectorModel;
    const isToday = startDate.isSame(day.date, 'day');

    return (
      <DateSlot
        width={slotWidth}
        key={day.date.toJSON()}
        today={isToday}
        day={day}
        onSelect={this.handleDateTimeClick}
        onViewMoreClick={this.handleViewMore}
        useCustomizedStyle={useCustomizedStyle}
      />
    );
  }

  @action
  setAppointmentTime = appointmentTime => {
    const { onSelect, dtSelectorModel } = this.props;
    onSelect && onSelect(appointmentTime);
    dtSelectorModel.closeDialog();
  };

  renderAppointmentTimes = (appointmentTime, idx) => (
    <AppointmentButton
      onClick={() => this.setAppointmentTime(appointmentTime.dateTime)}
      active={this.hovered}
      className={cx('appointmentBtn', { appointmentDlgButtonCustomized: this.props.useCustomizedStyle })}
      key={idx}
      label={appointmentTime.dateTime.format('h:mm a')}
    />
  );

  renderTimezoneLabel = () => {
    const { dtSelectorModel } = this.props;

    const { timezoneLabel } = dtSelectorModel;
    if (!timezoneLabel) return null;

    const lblTimezone = trans('TIME_ZONE', 'Time Zone: {{timezone}}', { timezone: timezoneLabel });
    return (
      <div className={cx('bottom')} data-id="dateSelectorTimeZone">
        <T.Caption secondary>{lblTimezone}</T.Caption>
      </div>
    );
  };

  @action
  _loadDaysAroundOffset = () => {
    const { props, offset, slotWidth, noOfDays } = this;

    const {
      timezoneModel: { timezone },
      dtSelectorModel,
    } = props;

    const { startDate } = dtSelectorModel;
    const noSlots = Math.floor(offset / slotWidth);
    const from =
      noSlots > 0
        ? toMoment(startDate, { timezone })
            .add(noSlots, 'days')
            .startOf('day')
        : startDate;

    dtSelectorModel.loadSlots({ from, noOfDays });
  };

  loadDaysAroundOffset = debounce(this._loadDaysAroundOffset, 100);

  @action
  _updateOffset = scrollLeft => {
    this.offset = scrollLeft;

    this.loadDaysAroundOffset();
  };

  updateOffset = debounce(this._updateOffset, 50);

  locateStickies = () => {
    const { scroller, months } = this;
    if (!scroller) return;
    const { scrollLeft } = scroller;

    this.animId = raf(() => {
      this.updateOffset(scrollLeft);

      months.forEach(({ month, label, monthRect, labelRect }) => {
        const { width: monthWidth } = monthRect;
        const { width: labelWidth } = labelRect;

        if (scrollLeft >= month.offsetLeft) {
          let pos = scrollLeft - month.offsetLeft;
          const leftPos = month.offsetLeft + (monthWidth - labelWidth);

          if (scrollLeft >= leftPos) {
            pos = leftPos - month.offsetLeft;
            label.setAttribute('style', `transform: translateX(${pos}px)`);
          } else {
            label.setAttribute('style', `transform: translateX(${scrollLeft - month.offsetLeft}px)`);
          }
        } else {
          label.setAttribute('style', '');
        }
      });
      if (this.scrolling) this.locateStickies();
    });
  };

  storeScrollerRef = ref => {
    this.scroller = ref;
    const { slotWidth } = this;

    this.scrollerInstance = ref ? new Scroller(ref, { snapSize: slotWidth }) : undefined;
  };

  cacheDimensions() {
    const { scroller: ref, scrollerInstance, slotWidth } = this;

    if (ref) {
      this.months = Array.from(ref.querySelectorAll(`.${cx('month')}`)).map(ele => {
        const label = ele.querySelector(`.${cx('dateAndMonth')}`);
        label.setAttribute('style', '');
        return {
          month: ele,
          label,
          monthRect: ele.getBoundingClientRect(),
          labelRect: label.getBoundingClientRect(),
        };
      });

      scrollerInstance.updateSnapSize(slotWidth);
    } else {
      this.months = null;
    }
  }

  componentDidMount() {
    this.cacheDimensions();

    const { selfServeModel } = this.props;
    this.stopReactingToDimensionChanges = reaction(() => ({ dim: selfServeModel.widgetDimensions }), () => this.handleDimensionChanges());
  }

  componentWillUnmount() {
    const { stopReactingToDimensionChanges } = this;
    stopReactingToDimensionChanges && stopReactingToDimensionChanges();
  }

  handleDimensionChanges = () => {
    this.resetOffset();
    this.cacheDimensions();
  };

  @computed
  get canMoveBackwards() {
    return this.offset > 0;
  }

  @computed
  get canMoveTowards() {
    const { offset, scrollerInstance } = this;
    if (!scrollerInstance || !offset) return true;
    return offset < (scrollerInstance || {}).maxScrollPos;
  }

  @action
  moveNext = () => {
    this.scrollerInstance.moveNext();
  };

  @action
  movePrev = () => {
    this.scrollerInstance.movePrev();
  };

  @action
  resetOffset = () => {
    this.scrollerInstance.scrollToPos(0);
  };

  _stopLoop = () => {
    this.scrolling = false;
  };

  stopLoop = debounce(this._stopLoop, 1000);

  startLoop = () => {
    this.scrolling = true;
    this.locateStickies();
    this.stopLoop();
  };

  render() {
    const { props } = this;
    const { dtSelectorModel, useCustomizedStyle, compact } = props;

    const { dateGroups } = dtSelectorModel;
    const hasDays = dateGroups && dateGroups.length > 0;
    const lblSelectTimeBelow = trans('SELECT_A_TIME_BELOW', 'Select a time below:');
    const lblRetry = trans('TRY_AGAIN', 'Retry');

    return (
      <div className={cx('DateSelector', { compact })} data-id="dateSelectorBody">
        <div className={cx('top')}>
          <Observer>
            {() => {
              const { offset } = this;
              const backToTodayEnabled = offset > 0;
              return (
                <div className={cx('backToToday', { hidden: !backToTodayEnabled }, { customizedBackToToday: useCustomizedStyle })} data-id="backToTodayButton">
                  <T.Text inline highlight={backToTodayEnabled} clickable={backToTodayEnabled} onClick={this.resetOffset}>
                    {trans('BACK_TO_TODAY', 'Back to Today')}
                  </T.Text>
                </div>
              );
            }}
          </Observer>
        </div>
        <div className={cx('days')} data-id="daysContainer">
          <Observer>
            {() => (
              <ArrowBlock disabled={!this.canMoveBackwards} onClick={this.movePrev}>
                <ChevronLeft data-id="dateSelectorChevronLeft" />
              </ArrowBlock>
            )}
          </Observer>
          <div onScroll={this.startLoop} ref={this.storeScrollerRef} className={cx('daysScroller')}>
            <div className={cx('daysScrollerWrapper')} data-id="daysScrollerWrapper">
              {hasDays && dateGroups.map(group => this.renderMonth(group))}
            </div>
          </div>
          {dtSelectorModel.loadingDates && !dtSelectorModel.datesDataIsCreated && <LoadingBlock className={cx('centralLoader')} />}
          <Observer>
            {() => (
              <ArrowBlock disabled={!this.canMoveTowards || !dtSelectorModel.datesDataIsCreated} onClick={this.moveNext}>
                <ChevronRight data-id="dateSelectorChevronRight" />
              </ArrowBlock>
            )}
          </Observer>
        </div>
        {this.renderTimezoneLabel()}
        <SimpleDialog
          dataId="slots-selector"
          dlgWrapperClassName={cx('dlgWrapper')}
          dlgBodyClassName={cx('dlgBody', { customizedDlgBodyStyle: useCustomizedStyle })}
          open={dtSelectorModel.dlgModel.isOpen}
          onCloseRequest={dtSelectorModel.dlgModel.close}>
          <Observer>
            {() => {
              const { appointmentTimes = [] } = dtSelectorModel.tentativeDate || {};
              return (
                <div data-id="dateSlotsDialogContainer">
                  <div className={cx('dlgHeader')} data-id="dateSlotsDialogHeader">
                    <T.Header className={cx('title')} bold>
                      {dtSelectorModel.tentativeDateFormatted}
                    </T.Header>
                    <T.Text>{lblSelectTimeBelow}</T.Text>
                  </div>
                  <div className={cx('appointments')} data-id="dateSlotsDialogBody">
                    {appointmentTimes.map(this.renderAppointmentTimes)}
                  </div>
                </div>
              );
            }}
          </Observer>
        </SimpleDialog>
        {dtSelectorModel.errorLoadingDates && (
          <ErrorBlock className={cx('errorBlock')} fill message={dtSelectorModel.errorLoadingDates}>
            <T.Link inline className={cx('retry')} onClick={() => dtSelectorModel.performLoadSlots()}>
              {lblRetry}
            </T.Link>
          </ErrorBlock>
        )}
      </div>
    );
  }
}
