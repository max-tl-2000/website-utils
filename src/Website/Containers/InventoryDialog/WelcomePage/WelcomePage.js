/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

import React, { Component } from 'react';
import { observer } from 'mobx-react';

import classNames from 'classnames/bind';
import styles from './WelcomePage.scss';
import { trans } from '../../../../common/trans';

import Carousel from '../../../../components/Carousel/Carousel';
import Button from '../../../../components/Button/Button';
import * as T from '../../../../components/Typography/Typopgraphy';
import LoadingBlock from '../../../../components/LoadingBar/LoadingBlock';
import { getFailedToLoadUnitError } from '../PersonalizedPrice/errors';

const cx = classNames.bind(styles);

@observer
class WelcomePage extends Component {
  render() {
    const { model, dlgModel, personalizedPriceClick, scheduleTourClick, matches, enableScheduleTour } = this.props;
    if (!model) return <noscript />;

    if (dlgModel?.error) {
      const errorMessage = getFailedToLoadUnitError();
      return (
        <div className={cx('Page', matches)} data-id="unitDialogPage">
          <div className={cx('ErrorWrapper')}>
            <T.Text error>{errorMessage}</T.Text>
          </div>
        </div>
      );
    }

    const footnoteTour = trans('TOUR_FOOTNOTE', 'Touring specific units is subject to availability at the time of tour.');
    const footnotePhotos = trans('FOOTER_NOTE', 'Photos and images may vary from actual apartments. Square footages are approximate and may vary slightly.');
    const footnoteMsg = `${footnotePhotos} ${footnoteTour}`;

    return (
      <div className={cx('Page', matches)} data-id="unitDialogPage">
        <div className={cx('Header')}>
          <div className={cx('Description')} data-id="unitDialogDescription">
            {!model.loading && (
              <>
                <T.Text>{trans('STARTING_PRICE', 'Starting at {{price}}', { price: model.price })}</T.Text>
                <T.Caption className={cx('amenities')} secondary>
                  {model.amenities.join(', ')}
                </T.Caption>
              </>
            )}
          </div>
          <div className={cx('Buttons', { noTour: !enableScheduleTour })} data-id="unitDialogButtons">
            {enableScheduleTour && (
              <Button
                type="flat"
                flat-version="2"
                wide={!matches?.small1}
                big={matches?.small2}
                label={trans('SCHEDULE_TOUR', 'Schedule a tour')}
                onClick={scheduleTourClick}
                className={cx('tourButton', { thin: matches?.xsmall && !matches?.small2 })}
              />
            )}
            <Button
              wide={!matches?.small1}
              big={matches?.small2}
              label={trans('GET_PERSONALIZED_PRICE', 'Get personalized price')}
              onClick={personalizedPriceClick}
            />
          </div>
        </div>
        {model.loading && <LoadingBlock height={100} />}
        {model.loaded && (
          <div>
            <Carousel
              className={cx('carousel')}
              height={matches?.small2 ? 400 : 250}
              pictures={model.images}
              videos={model.videos}
              tours={model.tours}
              noBtnLabels={!matches.medium}
            />
            <div className={cx('footerNote')}>
              <T.Caption className={cx('footnote')} secondary>
                <span className={cx('asterisk')}>*</span> <span>{footnoteMsg}</span>
              </T.Caption>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default WelcomePage;
