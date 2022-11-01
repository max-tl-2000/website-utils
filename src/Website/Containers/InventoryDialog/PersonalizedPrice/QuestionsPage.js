/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { computed, action } from 'mobx';

import classNames from 'classnames/bind';
import styles from './QuestionsPage.scss';
import { trans } from '../../../../common/trans';
import QuestionSection from './QuestionSection';
import { ContactFormComponent } from '../../../../Forms/ContactForm';
import * as T from '../../../../components/Typography/Typopgraphy';

const cx = classNames.bind(styles);

@inject('webSiteStore')
@observer
class QuestionsPage extends Component {
  @computed
  get sectionModels() {
    return this.props.questionsPageModel?.getSectionModels;
  }

  @computed
  get guestCardModel() {
    return this.props.guestCardModel;
  }

  @action
  handleBreakpointChange = ({ matches }) => {
    this.breakpoints = matches;
  };

  render() {
    const models = this.sectionModels;
    if (!models) return <noscript />;

    const { matches, webSiteStore } = this.props;

    return (
      <div className={cx('Page', matches)}>
        <div className={cx('Contact')}>
          <ContactFormComponent
            compact={!matches.small2}
            noScrollbars
            noPadding
            webSiteStore={webSiteStore}
            guestCardModel={this.guestCardModel}
            wide
            hideSubmit
            phoneMessage={
              <T.Caption className={cx('DimmedText')}>
                {trans('PHONE_USE', 'If you give us your mobile phone number, we can keep in touch with you via text.')}
              </T.Caption>
            }
          />
        </div>
        {!!models.length && (
          <div>
            <T.Text>
              {trans('SELECT_OPTIONS', 'Select additional options that you are interested in')}
              <sup>†</sup>
              {trans('DASH', ':')}
            </T.Text>
            <div className={cx('Questions')}>
              {models.map(model => (
                <QuestionSection matches={matches} key={model.getId} sectionModel={model} />
              ))}
            </div>
            <T.Caption className={cx('DimmedText')}>
              <sup>†</sup>
              {trans('SELECT_OPTIONS', 'There are costs associated with these options and will be explained in the price quote.')}
            </T.Caption>
          </div>
        )}
      </div>
    );
  }
}

export default QuestionsPage;
