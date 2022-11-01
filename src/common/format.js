/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

import { formatCurrency, formatNumber } from './numbers';
import { isNum } from './type-of';
import { now, toMoment } from './moment-utils';
import { YEAR_MONTH_DAY_FORMAT } from '../Website/helpers/dateConstants';

const US_LOCALE = 'en-US';

export const defaultCurrencyFormatterOpts = {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
};

const hasIntlSupport = () => typeof Intl === 'object' && typeof Intl.NumberFormat === 'function';

const getFormatter = (formatterOptions = {}, locale = US_LOCALE) => {
  if (!hasIntlSupport()) return null;
  return new Intl.NumberFormat(locale, formatterOptions);
};

export const asMoney = (amount, options = defaultCurrencyFormatterOpts) => {
  const { style = 'currency', currency = 'USD', minimumFractionDigits = 2 } = options;

  amount = isNum(amount) ? amount : parseFloat(amount);
  if (!isNum(amount)) return '';

  const formatter = getFormatter({ style, currency, minimumFractionDigits });
  if (formatter) return formatter.format(amount.toFixed(2));
  return formatCurrency(amount);
};

export const asNumber = (amount, options = {}) => {
  const formatter = getFormatter(options);
  if (formatter) return formatter.format(amount);
  return formatNumber(amount);
};

export const formatHours = hoursHash => {
  hoursHash = hoursHash || {};

  const ranges = [];
  const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  if (Object.keys(hoursHash).length === 0) {
    return '';
  }

  dayNames.forEach(dayName => {
    const dayInfo = hoursHash[dayName] || { startTime: '00:00', endTime: '00:00' };
    const range = ranges[ranges.length - 1] || { startTime: -1, endTime: -1 };

    if ((range.startTime === dayInfo.startTime && range.endTime === dayInfo.endTime) || (range.isClosed && dayInfo.startTime === dayInfo.endTime)) {
      range.days?.push(dayName);
    } else {
      const { startTime, endTime } = dayInfo;
      ranges.push({ startTime, endTime, days: [dayName], isClosed: startTime === endTime });
    }
  });

  return ranges
    .map(r => {
      const { days, startTime, endTime, isClosed } = r;

      let label = days[0].substr(0, 3);

      if (days.length > 1) {
        label = `${label}-${days[days.length - 1].substr(0, 3)}`;
      }

      if (isClosed) {
        return `${label} Closed`;
      }

      const date = now()
        .startOf('day')
        .format(YEAR_MONTH_DAY_FORMAT);

      const st = toMoment(`${date}T${startTime}:00`);
      const et = toMoment(`${date}T${endTime}:00`);

      const stDoesNotHaveMinutes = st.minutes() === 0;
      const etDoesNotHaveMinutes = et.minutes() === 0;

      const startTimeFormatted = stDoesNotHaveMinutes ? st.format('ha') : st.format('h:mma');
      const endTimeFormatted = etDoesNotHaveMinutes ? et.format('ha') : et.format('h:mma');

      return `${label} ${startTimeFormatted}-${endTimeFormatted}`;
    })
    .join(' | ');
};

export const formatTime = time => (time && time !== '00:00' ? time : undefined);
