/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

import React, { Component } from 'react';
import classnames from 'classnames/bind';
import { trans } from '../../../../common/trans';
import styles from './ThankYouPage.scss';
import * as T from '../../../../components/Typography/Typopgraphy';
import ThankYouCard from '../../../../BookAppointment/ThankYouCard/ThankYouCard';
import Button from '../../../../components/Button/Button';
import ThankYouImage from '../../../../resources/svgs/thankYouImage.svg';
import { getFailedToLoadUnitError } from './errors';

const cx = classnames.bind(styles);

class ThankYouPage extends Component {
  render() {
    const { closeDialog, matches, error } = this.props;
    const subTitle1 = trans('PERSONALIZED_PRIZE_SENT1', 'Your personalized price is on the way!*');
    const subTitle2 = trans('PERSONALIZED_PRICE_SENT2', 'We sent you an email so it’s easy to find.');
    const errorTitle = trans('PERSONALIZED_PRICE_ERROR_TITLE', 'Unit no longer available');
    const errorMessage = getFailedToLoadUnitError();

    return (
      <div className={cx('thankYouPage', matches)}>
        <ThankYouCard
          container={matches?.small2}
          thankYouSubTitle1={error ? errorTitle : subTitle1}
          thankYouSubTitle2={error ? errorMessage : subTitle2}
          thankYouImage={error ? <noscript /> : <ThankYouImage className={cx('thankYouImage')} />}
        />
        <Button
          onClick={closeDialog}
          className={cx('continueButton')}
          type="raised"
          btnRole="primary"
          label={trans('CONTINUE_EXPLORING', 'Continue exploring your community')}
        />
        {!error && (
          <T.Caption secondary className={cx('quoteFooter')}>
            {trans(
              'PRICE_QUOTE_FOOTER',
              '*Your price quote includes a link to our rental application, if you are ready to take the first step towards moving in to your new home.',
            )}
          </T.Caption>
        )}
      </div>
    );
  }
}

export default ThankYouPage;
