/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

import { observable, action, computed } from 'mobx';
import { toMoment, findLocalTimezone, parseAsInTimezone } from '../common/moment-utils';
import { DialogModel } from '../common/DialogModel';
import Request from '../common/request';

const INITIAL_DATES_TO_LOAD = 14;

class DateModel {
  @observable.shallow
  slots;

  @observable
  officeClosed;

  @observable
  date;

  @observable
  includeMonthAndYear;

  @observable.shallow
  appointments = [];

  @computed
  get appointmentTimes() {
    return this.appointments;
  }

  @computed
  get monthYear() {
    return this.date.format('YYYY-MM');
  }

  @computed
  get dateOnly() {
    return this.date.format('YYYY-MM-DD');
  }

  constructor({ date, parent } = {}) {
    this.parent = parent;
    this.pristine = true;

    this.date = date;
  }

  @action
  update({ officeClosed, slots = [] } = {}) {
    this.officeClosed = officeClosed;
    this.setSlots(slots);
    this.pristine = false;
  }

  @computed
  get timezone() {
    return this.parent.timezone;
  }

  @action
  setSlots(slots = []) {
    const { timezone } = this;
    if (!this.pristine) {
      this.pristine = true;
    }
    this.appointments = slots.map(slot => ({ dateTime: toMoment(slot, { timezone }), available: true }));
  }
}

export class DateTimeSelectorModel {
  @observable
  startDate;

  @observable
  tentativeDate;

  @observable
  _datesMap = observable.map([], { deep: false });

  @observable
  offset = 0;

  @action
  loadDateIntoMap = dayEntry => {
    const { day, officeClosed, slots = [] } = dayEntry;
    const date = parseAsInTimezone(day, { format: 'YYYY-MM-DD', timezone: this.timezone });

    const dateModel = this.findDateModelByDate(date);

    if (!dateModel) return;

    dateModel.update({ officeClosed, slots });
  };

  findDateModelByDate = date => {
    const monthKey = date.format('YYYY-MM');
    const map = this._datesMap.get(monthKey);

    if (!map) return null;

    const dayKey = date.format('YYYY-MM-DD');
    const dateModel = map.entries.get(dayKey);
    return dateModel;
  };

  @action
  handleResponse = responseArgs => {
    const { response = {}, state } = responseArgs || {};

    if (!response && state !== 'error') {
      responseArgs.state = 'error';
      responseArgs.error = 'NO_RESPONSE_RECEIVED';
      return;
    }

    if (state === 'error') return;

    const { propertyTimezone: timezone } = response;

    if (!this.timezone) {
      this.timezoneModel.setTimezone(timezone);
      this.createDateRange();
    }

    const { calendar = [] } = response;

    calendar.forEach(dayEntry => {
      this.loadDateIntoMap(dayEntry);
    });
  };

  @computed
  get dateGroups() {
    return Array.from(this._datesMap.values());
  }

  @action
  createDateRange() {
    const { startDate, timezone } = this;

    const tz = timezone || findLocalTimezone();
    const baseStartDate = toMoment(startDate, { timezone: tz });

    const endDate = baseStartDate
      .clone()
      .add(2, 'months')
      .startOf('date');

    let cDate = baseStartDate.clone();

    while (cDate.isSameOrBefore(endDate)) {
      this._setDate(new DateModel({ date: cDate, parent: this }));
      cDate = cDate.clone().add(1, 'day');
    }
  }

  @action
  _setDate(dateModel) {
    const { _datesMap } = this;

    const { monthYear, dateOnly } = dateModel;

    let monthMap = _datesMap.get(monthYear);
    if (!monthMap) {
      monthMap = { entries: observable.map([], { deep: false }), id: monthYear };
      _datesMap.set(monthYear, monthMap);
    }

    monthMap.entries.set(dateOnly, dateModel);
  }

  constructor({ startDate, service, timezoneModel, selfServeModel }) {
    this.startDate = startDate;

    this.timezoneModel = timezoneModel;
    this.dlgModel = new DialogModel();

    this.slotsRq = Request.create({
      call: payload =>
        service.getSlots({
          ...payload,
          campaignEmail: selfServeModel.campaignEmail,
          marketingSessionId: selfServeModel.marketingSessionId,
          propertyId: selfServeModel.propertyId,
        }),
      onResponse: this.handleResponse,
    });
  }

  @action
  fetchSlots = () => {
    this.loadSlots({ from: this.startDate, noOfDays: INITIAL_DATES_TO_LOAD }, true /* force */);
  };

  @action
  loadSlots = ({ from, noOfDays }, force) => {
    this._from = from;
    this._noOfDays = noOfDays;
    this.performLoadSlots(force);
  };

  @action
  performLoadSlots = force => {
    const { _from, _noOfDays, slotsRq } = this;
    const from = force ? _from : this.findFirstDateWithoutData(_from, _noOfDays);

    if (!from) return;

    slotsRq.execCall({ from, noOfDays: _noOfDays });
  };

  @computed
  get datesDataIsCreated() {
    const { _datesMap } = this;
    return _datesMap.size > 0 && Array.from(_datesMap.values()).some(map => map.entries.size > 0);
  }

  @action
  findFirstDateWithoutData = (from, noOfDays) => {
    const { timezone, datesDataIsCreated } = this;
    from = toMoment(from, { timezone });

    if (!datesDataIsCreated) return from;

    const endDate = from.clone().add(noOfDays, 'days');

    while (from.isSameOrBefore(endDate)) {
      const dateModel = this.findDateModelByDate(from);
      if (dateModel && dateModel.pristine) return dateModel.date;
      from = from.clone().add(1, 'day');
    }

    return undefined;
  };

  @action
  openDialog(tentativeDate) {
    this.tentativeDate = tentativeDate;
    this.dlgModel.open();
  }

  @computed
  get tentativeDateFormatted() {
    const { tentativeDate } = this;
    if (!tentativeDate) return '';
    return tentativeDate.date.format('dddd MMMM D');
  }

  @action
  closeDialog() {
    this.tentativeDate = null;
    this.dlgModel.close();
  }

  @computed
  get timezone() {
    return this.timezoneModel.timezone;
  }

  @computed
  get loadingDates() {
    return this.slotsRq.loading;
  }

  @computed
  get errorLoadingDates() {
    const {
      slotsRq: { error },
    } = this;
    if (error) {
      return `Failed to load the dates. Token: "${error}"`;
    }
    return '';
  }

  @computed
  get showTimezoneLabel() {
    const { timezone } = this;
    const tz = findLocalTimezone();
    return timezone && timezone !== tz;
  }

  @computed
  get timezoneLabel() {
    const { showTimezoneLabel, timezone } = this;
    return showTimezoneLabel ? timezone.replace(/_/g, ' ') : '';
  }
}
