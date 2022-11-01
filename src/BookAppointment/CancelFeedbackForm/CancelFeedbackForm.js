/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { observable, action } from 'mobx';
import classnames from 'classnames/bind';
import styles from './CancelFeedbackForm.scss';
import * as T from '../../components/Typography/Typopgraphy';
import { trans } from '../../common/trans';
import Button from '../../components/Button/Button';
import LoadingBlock from '../../components/LoadingBar/LoadingBlock';

const cx = classnames.bind(styles);

@inject('cancelFeedbackModel', 'selfServeModel')
@observer
export default class CancelFeedbackForm extends Component {
  @observable
  feedbackSent;

  @action
  setFeedbackSent = () => {
    this.feedbackSent = true;
  };

  @action
  handleSubmit = async () => {
    const { cancelFeedbackModel } = this.props;
    const { feedbackForm } = cancelFeedbackModel;

    await feedbackForm.validate();

    if (!feedbackForm.valid) return;

    const { serializedData: formData } = feedbackForm;

    await cancelFeedbackModel.saveFeedback(formData);

    if (cancelFeedbackModel.feedbackSentError) return;

    this.setFeedbackSent();
  };

  render() {
    const { feedbackSent, props } = this;
    const {
      cancelFeedbackModel,
      selfServeModel: { useLayoutSmall },
    } = props;
    const {
      feedbackForm: {
        fields: { feedback },
      },
    } = cancelFeedbackModel;

    const feedbackSentLabel = trans('FEEDBACK_SENT', 'Feedback sent.');
    const feedbackLabel = trans('WOULD_YOU_MIND_SHARING_FEEDBACK', "Would you mind sharing why you can't make the appointment?");
    const btnLabel = trans('SHARE_FEEDBACK', 'Share feedback');

    const width = useLayoutSmall ? '100%' : '500px';

    return (
      <div className={cx('Form')} style={{ width }}>
        {feedbackSent && (
          <T.Text className={cx('feedbackSent')} secondary>
            {feedbackSentLabel}
          </T.Text>
        )}
        {!feedbackSent && (
          <div>
            <T.Text className={cx('label')}>{feedbackLabel}</T.Text>
            <textarea
              disabled={cancelFeedbackModel.sendingFeedback}
              className={cx('textArea')}
              value={feedback.value}
              onChange={e => feedback.setValue(e.target.value)}
            />
            {feedback.errorMessage && <T.Text error>{feedback.errorMessage}</T.Text>}
            {cancelFeedbackModel.feedbackSentError && <T.Text error>{cancelFeedbackModel.feedbackSentError}</T.Text>}
            <div className={cx('actions')}>
              <Button disabled={cancelFeedbackModel.sendingFeedback} label={btnLabel} onClick={this.handleSubmit} />
            </div>
            {cancelFeedbackModel.sendingFeedback && <LoadingBlock />}
          </div>
        )}
      </div>
    );
  }
}
