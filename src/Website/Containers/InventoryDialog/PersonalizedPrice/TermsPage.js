/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

import React, { Component } from 'react';
import classNames from 'classnames/bind';
import { observer } from 'mobx-react';
import { action, computed } from 'mobx';
import styles from './TermsPage.scss';
import { trans } from '../../../../common/trans';
import { now, parseAsInTimezone, DATE_ISO_FORMAT } from '../../../../common/moment-utils';
import { YEAR_MONTH_DAY_FORMAT } from '../../../helpers/dateConstants';
import LightButton from '../../../Components/LightButton/LightButton';
import DateSelector from '../../../../components/DateSelector/DateSelector';
import PickBox from '../../../../components/PickBox/PickBox';
import Field from '../../../../components/Field/Field';
import * as T from '../../../../components/Typography/Typopgraphy';

const cx = classNames.bind(styles);

@observer
class TermsPage extends Component {
  @computed
  get model() {
    return this.props.termsModel;
  }

  @computed
  get displayDate() {
    const { model } = this;
    const { suggestedMoveInDate, moveInDate } = model;

    return suggestedMoveInDate || moveInDate;
  }

  @action
  toggleExpandTerms = () => {
    const expandTerms = this.model?.expandTerms;
    this.model?.setExpandTerms(!expandTerms);
    this.toggleBtnLabel(!expandTerms);
  };

  handleClick = term => {
    const { id, selected } = term;
    this.model?.inventoryPricing?.select(id, !selected);

    if (!selected) this.model?.addToSelectedTermLengths(term.id);
    else this.model?.removeFromSelectedTermLengths(term.id);
  };

  shouldDisplayBestPrice = (closestLowestRent, marketRent) => {
    const { moveInDate } = this.model;
    const { moveInDate: closestLowestMoveInDate = '', marketRent: closestLowestMarketRent = '' } = closestLowestRent;

    if (!closestLowestMarketRent || closestLowestMarketRent === parseInt(marketRent, 10)) return false;
    if (!closestLowestMoveInDate || closestLowestMoveInDate === moveInDate.format(YEAR_MONTH_DAY_FORMAT)) return false;

    return true;
  };

  renderTerm = term => {
    const { matches } = this.props;
    const { termLength, marketRent, closestLowestRent } = term.originalItem;
    const { moveInDate: closestLowestMoveInDate = '', marketRent: closestLowestMarketRent = '' } = closestLowestRent;
    const period = `${term.originalItem.period || 'month'}s`;
    const currency = '$';
    const termPeriod = trans('TERM_PERIOD', '{{termLength}} {{period}}', { termLength, period });
    const monthRent = trans('MONTH_RENT', '{{currency}}{{roundedMarketRent}} / mo', { currency, roundedMarketRent: Math.round(parseInt(marketRent, 10)) });
    const formattedLowestMoveInDate =
      closestLowestMoveInDate && parseAsInTimezone(closestLowestMoveInDate, { format: DATE_ISO_FORMAT, timezone: this.model.propertyTimezone }).format('MM/DD');

    const bestPriceMessage = trans('ADJUSTED_PRICE', 'Move in on {{formattedLowestMoveInDate}} for {{currency}}{{closestLowestMarketRent}} / mo', {
      formattedLowestMoveInDate,
      closestLowestMarketRent: closestLowestMarketRent ? Math.round(closestLowestMarketRent) : '',
      currency,
    });

    const handler = e => {
      e.preventDefault();
      this.handleClick(term);
    };

    const [col1, col2] = this.getColsBasedOnMatches();

    return (
      <div data-id="lease-term" key={term.id} className={cx('LeaseTerm')}>
        <Field columns={col1} noMargin inline noMinHeight>
          <div key={term.id} onClick={handler} data-id="termLength">
            <PickBox label={termPeriod} value={termLength} checked={term.selected} labelClassName={cx('label')} />
          </div>
        </Field>
        <Field wrapperClassName={cx('fieldWrapper')} columns={col2} noMargin inline noMinHeight last>
          <T.Caption noMargin inline={matches.small2}>
            {monthRent}
            {term.selected && this.shouldDisplayBestPrice(closestLowestRent, marketRent) && (
              <span data-id="best-price-text" className={cx('BestPriceText')}>
                {bestPriceMessage}
              </span>
            )}
          </T.Caption>
        </Field>
      </div>
    );
  };

  @action
  handleMoveInDateChange = value => {
    this.model.setMoveInDate(value);
  };

  toggleBtnLabel(expandTerms) {
    this.btnLabel = expandTerms ? trans('SHOW_DEFAULT_LEASE_TERMS', 'Show less') : trans('SHOW_ALL_LEASE_TERMS', 'Show all lease term options');
  }

  getColsBasedOnMatches() {
    const { matches } = this.props;

    if (matches?.small2) {
      return [3, 9];
    }

    if (matches?.small1) {
      return [4, 8];
    }

    if (matches?.xsmall) {
      return [6, 6];
    }

    return [6, 6];
  }

  render() {
    const { model } = this;
    if (!model) return <noscript />;

    const { validationMessage, matches, className, selfServeAllowExpandLeaseLengthsForUnits: allowExpandLeaseLengths } = this.props;

    const { propertyTimezone, closestDateMessage } = model;

    const minDate = now({ timezone: propertyTimezone }).startOf('day');

    const { inventoryPricing = {} } = model;
    const { items = [] } = inventoryPricing;

    const [col1, col2] = this.getColsBasedOnMatches();

    return (
      <div className={cx('TermsPageContainer', matches, className)} data-id="TermsPageContainer">
        <div className={cx('MoveInDateSection')}>
          <T.Caption>{trans('PLAN_TO_MOVE_IN', 'When do you plan to move in?')}</T.Caption>
          <DateSelector
            compact={!matches.small2}
            onChange={this.handleMoveInDateChange}
            selectedDate={this.displayDate}
            min={minDate}
            tz={propertyTimezone}
            wide={true}
          />
          {closestDateMessage && <T.Caption error>{closestDateMessage}</T.Caption>}
        </div>
        <div className={cx('SelectLeaseTerms')}>
          <T.Text noMargin>{trans('SELECT_LEASE_TERMS', 'Select interested lease terms:')} </T.Text>
          {validationMessage && (
            <T.Caption className={cx('validationMessage')} error>
              {validationMessage}
            </T.Caption>
          )}
        </div>
        <div className={cx('LeaseTerm', 'firstRow')}>
          <Field columns={col1} noMargin inline noMinHeight>
            <T.Caption noMargin className={cx('LightBold', 'firstCol')}>
              {trans('TERM', 'Term')}
              <sup>&nbsp;</sup>
            </T.Caption>
          </Field>
          <Field columns={col2} noMargin inline noMinHeight last>
            <T.Caption noMargin className={cx('LightBold')}>
              {trans('PRICE_WITHOUT_ADDITIONAL_OPTIONS', 'Price')}
              <sup>†</sup>
            </T.Caption>
          </Field>
        </div>
        {items.map(term => (this.model?.expandTerms || term.originalItem.isDefaultTerm) && this.renderTerm(term))}
        <LightButton
          className={cx('btn', { allowExpandLeaseLengths })}
          type="flat"
          btnRole="primary"
          label={this.btnLabel || trans('SHOW_ALL_LEASE_TERMS', 'Show all lease term options')}
          onClick={() => this.toggleExpandTerms()}
        />
        <T.Caption className={cx('FooterNote')} secondary>
          <sup>†</sup>
          {trans('PRICE_FOOTER_NOTE', 'excludes additional options chosen in the previous step')}
        </T.Caption>
      </div>
    );
  }
}

export default TermsPage;
