/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

/* eslint-disable react/no-multi-comp */
import classNames from 'classnames/bind';
import { action } from 'mobx';
import { observer } from 'mobx-react';
import React, { Component } from 'react';
import { isMoment, isSameDay, now } from '../../common/moment-utils';
import { DateSelectorModel } from '../../Models/DateSelectorModel';
import ChevronLeftSvg from '../../resources/svgs/chevron-left.svg';
import ChevronRightSvg from '../../resources/svgs/chevron-right.svg';
import IconButton from '../IconButton/IconButton';
import Revealer from '../Revealer/Revealer';
import Scrollable from '../Scrollable/Scrollable';
import * as T from '../Typography/Typopgraphy';
import styles from './Calendar.scss';
import Day from './Day';

const cx = classNames.bind(styles);

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
export default class Calendar extends Component {
  constructor(props) {
    super(props);
    this.model = new DateSelectorModel(props);
  }

  @action
  focusDay(value) {
    this.model.focusDate(value);
    this.props.onChange(value);
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

  render() {
    const { props, model } = this;
    const { compact } = props;

    return (
      <div className={cx('container-wrapper')}>
        <Revealer className={cx('panel')} enterClass={cx('enter')} exitClass={cx('exit')} enterDoneClass={cx('done')} show={true}>
          <div className={cx('month-nav')} data-id="CalendarMonthHeader">
            <IconButton data-part="prev-month" ref={this.storePrevMonthTriggerRef} type={'flat'} icon={ChevronLeftSvg} onClick={this.navigatePrevMonth} />
            <div className={cx('month-container')}>
              <T.Text className={cx('month-text')}>{model.navigationMonthNameAndYear}</T.Text>
            </div>
            <IconButton data-part="next-month" ref={this.storeNextMonthTriggerRef} type={'flat'} icon={ChevronRightSvg} onClick={this.navigateNextMonth} />
          </div>
          <Scrollable className={cx('scrollable-body')}>
            <div className={cx('body')} tabIndex={0} onKeyUp={this.checkEnter} onKeyDown={this.handleKeyNavigation} data-id="CalendarMonthContainer">
              {this.renderMonth(model, { compact })}
            </div>
          </Scrollable>
        </Revealer>
      </div>
    );
  }
}
