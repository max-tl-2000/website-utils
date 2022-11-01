/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

/* eslint-disable react/no-multi-comp */
import React, { Component } from 'react';
import { observable, action } from 'mobx';
import { observer } from 'mobx-react';
import classNames from 'classnames/bind';
import throttle from 'throttly';
import debounce from 'debouncy';
import { trans } from '../../common/trans';
import { DateSelectorModel } from '../../Models/DateSelectorModel';
import ChevronLeftSvg from '../../resources/svgs/chevron-left.svg';
import ChevronRightSvg from '../../resources/svgs/chevron-right.svg';
import * as T from '../Typography/Typopgraphy';
import Button from '../Button/Button';
import styles from './DateSelector.scss';
import IconButton from '../IconButton/IconButton';
import shallowCompare from '../../common/shallowCompare';
import Revealer from '../Revealer/Revealer';
import FilterableList from '../Filterable/FilterableList';
import nullish from '../../common/nullish';
import TextBox from '../TextBox/TextBox';
import { isMoment, now, isSameDay } from '../../common/moment-utils';
import Portal from '../Portal/Portal';
import { position } from '../../Website/helpers/position';
import { contains } from '../../common/dom';
import Scrollable from '../Scrollable/Scrollable';
import { windowWidth, windowHeight, isLandscape } from '../../Website/helpers/screen';

const cx = classNames.bind(styles);

const ARROW_UP = 38;
const ARROW_DOWN = 40;
const ARROW_LEFT = 37;
const ARROW_RIGHT = 39;
const ENTER = 13;
const THRESHOLD_TO_CALCULATE_STYLE = 16;

class Day extends Component {
  shouldComponentUpdate(nextProps) {
    const toCompare = ['selected', 'disabled', 'selectable', 'header', 'today', 'dayToRender', 'monthToRender'];

    return !shallowCompare(nextProps, this.props, toCompare);
  }

  render() {
    const { selected, selectable, onClick, header, today, dayToRender, disabled, compact } = this.props;
    const blue = today && !selected;

    return (
      <div
        data-part="day"
        data-selected={selected}
        data-selectable={selectable}
        data-disabled={disabled}
        className={cx('day', { selected, selectable, disabled })}
        onClick={(selectable && (() => onClick && onClick())) || (() => {})}>
        <div className={cx('day-wrapper')}>
          <div data-part="circle" className={cx('circle')}>
            <svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
              <circle cx="20" cy={compact ? '18' : '20'} r={compact ? '18' : '20'} />
            </svg>
          </div>
          <div className={cx('day-number-container')}>
            <T.Caption
              data-today={today}
              className={cx('day-number', { blue })}
              secondary={header || disabled}
              lighterForeground={selected && !disabled}
              data-id="DayNumberContainer">
              {dayToRender}
            </T.Caption>
          </div>
        </div>
      </div>
    );
  }
}

const getDayToRender = dayToRender => {
  if (isMoment(dayToRender)) {
    return dayToRender.date();
  }
  return dayToRender;
};

const getMonthToRender = monthToRender => {
  if (isMoment(monthToRender)) {
    return monthToRender.month();
  }
  return monthToRender;
};

@observer
export default class DateSelector extends Component {
  @observable
  model;

  @observable
  fOpen;

  @observable
  viewingMonth = true;

  constructor(props) {
    super(props);
    this.model = new DateSelectorModel(props);
  }

  @action
  closeFlyOut = () => {
    if (!this.fOpen) return;
    this.fOpen = false;
  };

  @action
  openFlyOut = () => {
    if (this.fOpen) return;
    this.fOpen = true;
  };

  @action
  debounceOpen = debounce(this.openFlyOut, 32);

  @action
  UNSAFE_componentWillReceiveProps(nextProps) {
    const { model } = this;

    if (nextProps.tz !== model.tz) {
      model.setTz(nextProps.tz);
    }

    if (model.selectedDate !== nextProps.selectedDate && !isSameDay(model.selectedDate, nextProps.selectedDate, { timezone: nextProps.tz })) {
      model.setSelectedDate(nextProps.selectedDate);
    }

    if (model.min !== nextProps.min && !isSameDay(model.min, nextProps.min, { timezone: nextProps.tz })) {
      model.setMin(nextProps.min);
    }

    if (model.max !== nextProps.max && !isSameDay(model.max, nextProps.max, { timezone: nextProps.tz })) {
      model.setMax(nextProps.max);
    }

    if (model.isDateDisabled !== nextProps.isDateDisabled) {
      model.setIsDateDisabledFn(nextProps.isDateDisabled);
    }
  }

  @action
  focusDay(value) {
    this.model.focusDate(value);
  }

  renderDay = ({ value, isToday: today, header, dayToRender, selected, selectable, disabled, key, monthToRender, compact }) => (
    <Day
      compact={compact}
      key={key}
      onClick={() => this.focusDay(value)}
      today={today}
      header={header}
      dayToRender={dayToRender}
      monthToRender={monthToRender}
      selected={selected}
      selectable={selectable}
      disabled={disabled}
    />
  );

  renderMonth = ({ viewWindowEntries: daysOfMonth, theSelectedDate: selectedDate, tz } = {}, { compact } = {}) => {
    let index = 0;

    const elements = [];
    const maxIndex = daysOfMonth.length;
    const today = now({ timezone: tz });

    while (index < maxIndex) {
      const daysArr = [];
      for (let i = 0; i < 7; i++) {
        if (index < maxIndex) {
          const { value, selectable, offset, disabled, header } = daysOfMonth[index];
          const dayToRender = getDayToRender(value);
          const monthToRender = getMonthToRender(value);
          const isToday = !header && !offset && isSameDay(value, today, { timezone: tz });
          const selected = selectedDate && selectable && isSameDay(value, selectedDate, { timezone: tz });
          daysArr.push(
            this.renderDay({
              compact,
              value,
              header,
              isToday,
              dayToRender,
              selectable: selectable && !disabled,
              selected,
              key: `${index}_${i}`,
              disabled,
              monthToRender,
            }),
          );
          index++;
        }
      }
      elements.push(daysArr);
    }
    // eslint-disable-next-line
    return elements.map((days, index) => <div className={cx('row')} key={index}>{days.map(day => day)}</div>);
  };

  @action
  commitValueAndClose = () => {
    const { model, props } = this;
    const prevSelected = model.selectedDate ? model.selectedDate.clone() : null;

    if (model.shouldDateBeDisabled(model.temporarySelectedDate)) return;

    model.commitSelection();
    this.closeFlyOut();

    const { onChange, tz } = props;
    if (!isSameDay(prevSelected, model.selectedDate, { timezone: tz })) {
      onChange && onChange(model.selectedDate);
    }
  };

  @action
  handleKeyNavigation = e => {
    let offset;

    if (e.keyCode === ARROW_LEFT) {
      offset = -1;
    }
    if (e.keyCode === ARROW_RIGHT) {
      offset = +1;
    }
    if (e.keyCode === ARROW_UP) {
      offset = -7;
    }
    if (e.keyCode === ARROW_DOWN) {
      offset = +7;
    }

    const { model } = this;

    if (offset) {
      model.moveDateByOffset(offset);
    }

    e.preventDefault && e.preventDefault();
  };

  checkEnter = e => {
    if (e.keyCode === ENTER) {
      this.commitValueAndClose();
    }
  };

  @observable
  showOverlay;

  @action
  handleOpen = () => {
    const { overlayRef } = this;
    if (overlayRef) {
      overlayRef.focus();
      this.showOverlay = true;
    }
  };

  @action
  handleClosing = () => {
    const { model, triggerRef } = this;
    model.clearTemporarySelection();

    if (triggerRef) {
      this.disableFocusAction = true;
      triggerRef.focusInput();
      this.enableFocusAction = true;
    }
  };

  storeOverlayRef = ref => {
    this.overlayRef = ref;
  };

  storeTrigger = ref => {
    this.triggerRef = ref;
  };

  @action
  navigateNextMonth = () => {
    this.model.nextMonth();
  };

  @action
  navigatePrevMonth = () => {
    this.model.prevMonth();
  };

  storePrevMonthTriggerRef = ref => {
    this.prevMonthTriggerRef = ref;
  };

  storeNextMonthTriggerRef = ref => {
    this.nextMonthTriggerRef = ref;
  };

  @action
  toggleShowYear = () => {
    this.viewingMonth = !this.viewingMonth;
  };

  @action
  handleClose = () => {
    this.viewingMonth = true;
    this.showOverlay = false;
  };

  @action
  toggleShowYearIfEnter = e => {
    if (e.key !== 'Enter') return;
    this.toggleShowYear();
  };

  @action
  changeNavigationYear = (selection = {}) => {
    const { id: year } = selection;

    if (!nullish(year)) {
      this.model.setYear(year);
      this.viewingMonth = true;
    }
  };

  focusOnFilter = () => {
    this.refFilterableList.focus();
  };

  storeFilterableListRef = ref => (this.refFilterableList = ref);

  handleKeyUp = e => {
    const ignoredKeys = ['Tab', 'Shift', 'Esc', 'CapsLock', 'Meta', 'Ctrl'];
    if (!ignoredKeys.find(key => key === e.key)) {
      this.openFlyOut();
      e.preventDefault();
      e.stopPropagation();
    }
  };

  clearDate = () => {
    const { model, props, triggerRef } = this;

    const prevSelected = model.selectedDate ? model.selectedDate.clone() : null;

    model.clearDate();
    const { onChange, tz } = props;

    if (!isSameDay(prevSelected, model.selectedDate, { timezone: tz })) {
      onChange && onChange(model.selectedDate);
    }

    if (triggerRef) {
      triggerRef.focusInput();
    }
  };

  handleBlur = () => {
    if (!this.triggerRef.value) {
      this.model.setSelectedDate(this.model.theSelectedDate);
    }
  };

  storeTriggerWrapper = ref => {
    this.triggerWrapper = ref;
  };

  storePortalRef = ref => {
    this.portalRef = ref;
  };

  @action
  calculateStyle = () => {
    const { portalRef, triggerWrapper, props } = this;
    const { keepInsideViewport = true, modal } = props;

    const portal = portalRef?.wrappedInstance?.portal;
    if (!portal || !triggerWrapper) return;
    if (modal) {
      portal.style.cssText = '';
      return;
    }
    const oPosition = position(portal, { my: 'left top', at: 'left bottom', of: triggerWrapper, keepInsideViewport });
    const { left, top } = oPosition;

    portal.style.cssText = `transform:translate3d(${Math.floor(left)}px,${Math.floor(top)}px, 0)`;
  };

  @action
  calculateNewPosition = () => {
    this.throttledCalculateStyle();
  };

  throttledCalculateStyle = throttle(() => {
    this.calculateStyle();
  }, THRESHOLD_TO_CALCULATE_STYLE);

  componentDidMount() {
    this.calculateStyle();

    window.addEventListener('scroll', this.calculateNewPosition, true);
    window.addEventListener('resize', this.calculateNewPosition);

    this.calculateNewPosition();
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.calculateNewPosition, true);
    window.removeEventListener('resize', this.calculateNewPosition);
  }

  componentDidUpdate() {
    this.calculateNewPosition();
  }

  handleOnTapAway = args => {
    args.cancel = contains(this.triggerWrapper, args.target);
  };

  handleFocus = () => {
    const { disableFocusAction } = this;
    if (disableFocusAction) {
      return;
    }

    this.handleOpen();
  };

  render() {
    const { fOpen, props, model } = this;
    const {
      format = 'MMMM DD, YYYY',
      placeholder,
      textBoxClassName,
      disabled,
      wide,
      errorMessage,
      compact,
      autoFocus,
      horizontal,
      modal,
      autoBestFit = true,
    } = props;
    const value = model.selectedDate ? model.selectedDate.format(format) : '';

    let theModal = modal;
    let theHorizontal = horizontal;

    if (autoBestFit) {
      const wWidth = windowWidth();
      const wHeight = windowHeight();
      theModal = wWidth < 600 || wHeight < 600;
      theHorizontal = isLandscape();
    }

    return (
      <div data-component="date-selector" className={cx('date-selector', { wide })}>
        <div ref={this.storeTriggerWrapper} className={cx('selector-input-container')} data-id="selectorInputContainer">
          <TextBox
            clearTextRequest={this.clearDate}
            placeholder={placeholder}
            ref={this.storeTrigger}
            onKeyUp={this.handleKeyUp}
            onFocus={this.handleFocus}
            onClick={this.debounceOpen}
            readOnly
            data-part="date-selector-input"
            className={textBoxClassName}
            showClear={false}
            forceClearVisible={fOpen && !!value}
            disabled={disabled}
            wide={wide}
            value={value}
            error={errorMessage}
            onBlur={this.handleBlur}
            tabIndex={0}
            autoFocus={autoFocus}
          />
        </div>
        <Portal overlayClassName={cx('overlay', { modal: theModal, showing: this.showOverlay, open: fOpen })} ref={this.storePortalRef}>
          <Revealer
            data-component="calendar-container"
            className={cx('calendar-container', { compact })}
            onEnterStart={this.handleOpen}
            show={fOpen}
            onTapAway={this.handleOnTapAway}
            closeOnTapAway
            onExitStart={this.handleClosing}
            onExit={this.handleClose}
            data-id="CalendarContainer"
            onCloseRequest={this.closeFlyOut}>
            <div className={cx('direction-wrapper', { horizontal: theHorizontal })}>
              <div data-part="header" className={cx('header')}>
                <T.Text
                  className={cx('yearSelector')}
                  tabIndex={0}
                  lighterForeground
                  secondary
                  onClick={this.toggleShowYear}
                  onKeyUp={this.toggleShowYearIfEnter}>
                  {model.selectedYear}
                </T.Text>
                <T.Title className={cx('dayOfWeek')} lighterForeground>
                  {model.selectedDayOfWeekMonthAndDate}
                </T.Title>
              </div>
              <div className={cx('container')}>
                <div className={cx('container-wrapper')}>
                  <Revealer className={cx('panel')} enterClass={cx('enter')} exitClass={cx('exit')} enterDoneClass={cx('done')} show={this.viewingMonth}>
                    <div className={cx('month-nav')} data-id="CalendarMonthHeader">
                      <IconButton
                        data-part="prev-month"
                        ref={this.storePrevMonthTriggerRef}
                        type={'flat'}
                        icon={ChevronLeftSvg}
                        onClick={this.navigatePrevMonth}
                      />
                      <div className={cx('month-container')}>
                        <T.Text className={cx('month-text')}>{model.navigationMonthNameAndYear}</T.Text>
                      </div>
                      <IconButton
                        data-part="next-month"
                        ref={this.storeNextMonthTriggerRef}
                        type={'flat'}
                        icon={ChevronRightSvg}
                        onClick={this.navigateNextMonth}
                      />
                    </div>
                    <Scrollable className={cx('scrollable-body')}>
                      <div
                        className={cx('body')}
                        ref={this.storeOverlayRef}
                        tabIndex={0}
                        onKeyUp={this.checkEnter}
                        onKeyDown={this.handleKeyNavigation}
                        data-id="CalendarMonthContainer">
                        {this.renderMonth(model, { compact })}
                      </div>
                    </Scrollable>
                  </Revealer>
                  <Revealer
                    className={cx('panel')}
                    enterClass={cx('enter')}
                    exitClass={cx('exit')}
                    onEnter={this.focusOnFilter}
                    enterDoneClass={cx('done')}
                    show={!this.viewingMonth}>
                    <FilterableList
                      ref={this.storeFilterableListRef}
                      wide
                      listHeight={240}
                      items={model.availableYears}
                      selectedIds={[model.selectedYear]}
                      onChange={this.changeNavigationYear}
                    />
                  </Revealer>
                </div>
                <div className={cx('actions')} data-id="CalendarButtons">
                  <Button data-part="close-overlay" btnRole="secondary" tabIndex={0} type="flat" label={trans('CANCEL', 'Cancel')} onClick={this.closeFlyOut} />
                  <Button data-part="ok" tabIndex={0} type="flat" label={trans('OK', 'Ok')} onClick={this.commitValueAndClose} />
                </div>
              </div>
            </div>
          </Revealer>
        </Portal>
      </div>
    );
  }
}
