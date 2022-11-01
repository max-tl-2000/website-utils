/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { observable, action } from 'mobx';
import classnames from 'classnames/bind';

import * as T from '../../components/Typography/Typopgraphy';
import { trans } from '../../common/trans';
import DayClosed from '../resources/dayClosed.svg';
import CallendarFull from '../resources/CalendarFull.svg';

import styles from './DateSlot.scss';
import AppointmentButton from '../AppointmentButton/AppointmentButton';
import LoadingBlock from '../../components/LoadingBar/LoadingBlock';

import { computedFontSize, computedStyles } from '../../common/computed-styles';

const cx = classnames.bind(styles);

@observer
export default class DateSlot extends Component {
  constructor(props) {
    super(props);
    this.state = { aptButtonWidth: null };
    this.dateSlotRef = React.createRef();
    this.dateSlotInnerRef = React.createRef();
  }

  @observable
  hovered;

  handleViewMore = () => {
    const { onViewMoreClick, day } = this.props;
    onViewMoreClick && onViewMoreClick(day);
  };

  @action
  handleMouseEnter = () => {
    this.hovered = true;
  };

  @action
  handleMouseLeave = () => {
    this.hovered = false;
  };

  handleSetBtnWidth = value => {
    this.setState({
      aptButtonWidth: `appointmenButton${value}`,
    });
  };

  renderAppointmentTime = (appointmentTime, idx) => (
    <AppointmentButton
      onClick={() => this.setAppointmentTime(appointmentTime.dateTime)}
      active={this.hovered}
      className={cx('button', { customizedAppBtn: this.props.useCustomizedStyle }, this.state.aptButtonWidth)}
      key={idx}
      label={appointmentTime.dateTime.format('h:mm a')}
    />
  );

  setAppointmentTime = appointmentTime => {
    const { onSelect } = this.props;
    onSelect && onSelect(appointmentTime);
  };

  extractComputedFontSizeAsInt = fontSizeString => {
    // returns string as fontSize int + px
    if (!fontSizeString) return null;
    return parseInt(fontSizeString.replace('px', ''), 10);
  };

  setADAFontSize = dateEl => {
    if (!dateEl) return;

    const btnWidth = {
      xlarge: 'Xlarge',
      large: 'Large',
    };
    const dateSlotSizes = {
      xlarge: '420px',
      large: '320px',
      medium: '300px',
    };

    const dateSlotEl = this.dateSlotRef.current;
    const dateSlotInnerEl = this.dateSlotInnerRef.current;

    const compStyles = window.getComputedStyle(dateSlotEl);
    const stylesFontSize = this.extractComputedFontSizeAsInt(compStyles.getPropertyValue(computedStyles.fontSize));

    if (stylesFontSize >= computedFontSize.xlarge) {
      dateSlotInnerEl.style.height = dateSlotSizes.xlarge;
      this.handleSetBtnWidth(btnWidth.xlarge);
    } else if (stylesFontSize >= computedFontSize.large) {
      dateSlotInnerEl.style.height = dateSlotSizes.large;
      this.handleSetBtnWidth(btnWidth.large);
    } else if (stylesFontSize >= computedFontSize.medium && stylesFontSize < computedFontSize.large) {
      dateSlotInnerEl.style.height = dateSlotSizes.medium;
    }
  };

  componentDidMount() {
    this.setADAFontSize(this.dateSlotRef?.current);
  }

  render() {
    const { props, hovered } = this;
    const { day, today, width, useCustomizedStyle } = props;
    const { date, appointmentTimes, officeClosed: closed, pristine } = day;

    const closedText = trans('CLOSED', 'Closed');
    const viewMoreText = trans('VIEW_MORE', 'View more');
    const allBookedText = trans('ALL_BOOKED', 'All booked');

    const moreThanThreeAppointments = appointmentTimes.length > 3;
    const hasAppointments = appointmentTimes.length > 0;
    const noAppointments = !hasAppointments;

    const viewMoreVisible = !closed && moreThanThreeAppointments;
    const allBookedVisible = !closed && noAppointments;

    return (
      <div
        style={{ width }}
        ref={this.dateSlotRef}
        className={cx('DateSlot')}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
        data-id="dateSlot"
        data-hovered={hovered}
        data-today={today}>
        <div className={cx('dateSlotInner', { today, hovered, customizedTodayBackground: useCustomizedStyle })} ref={this.dateSlotInnerRef}>
          <div className={cx('dateBlock')}>
            <T.Text uppercase secondary className={cx('text dayOfWeek', { hovered })} data-id="dayOfWeek">
              {date.format('ddd')}
            </T.Text>
            <T.Text secondary className={cx('text', 'date', { hovered })} data-id="dateOfTheMonth">
              {date.format('D')}
            </T.Text>
          </div>
          {pristine && (
            <div className={cx('loadingBlock')}>
              <LoadingBlock />
            </div>
          )}
          {!pristine && (
            <div className={cx('middleContainer')}>
              {hasAppointments && !closed && (
                <div className={cx('appointmentsWrapper')} data-id="appointmentsButtonContainer">
                  {appointmentTimes.slice(0, 3).map(this.renderAppointmentTime)}
                </div>
              )}
              {closed && <DayClosed />}
              {allBookedVisible && <CallendarFull />}
            </div>
          )}
          {!pristine && (
            <div className={cx('viewMoreSection')} data-id="viewMoreButton">
              {closed && <T.Text className={cx('text', { hovered })}>{closedText}</T.Text>}
              {viewMoreVisible && (
                <T.Text clickable className={cx('text', 'viewMore', { hovered })} onClick={this.handleViewMore}>
                  {viewMoreText}
                </T.Text>
              )}
              {allBookedVisible && <T.Text className={cx('text')}>{allBookedText}</T.Text>}
            </div>
          )}
        </div>
      </div>
    );
  }
}
