/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

import React, { Component } from 'react';
import { observer } from 'mobx-react';
import classNames from 'classnames/bind';
import styles from './PrimaryQuestion.scss';
import { trans } from '../../../../common/trans';
import { PickType } from '../../../../components/PickBox/PickBox';
import SelectionGroup from '../../../../components/SelectionGroup/SelectionGroup';
import Dropdown from '../../../../components/Dropdown/Dropdown';
import Field from '../../../../components/Field/Field';
import * as T from '../../../../components/Typography/Typopgraphy';

const cx = classNames.bind(styles);
export const selectionGroupValues = {
  YES: 'YES',
  NO: 'NO',
};

const selectionGroupItems = [
  { id: 1, text: trans('YES', 'Yes'), value: selectionGroupValues.YES },
  { id: 2, text: trans('NO', 'No'), value: selectionGroupValues.NO },
];

@observer
class PrimaryQuestion extends Component {
  getDropdownItems = maximumCountAnswer =>
    Array(maximumCountAnswer)
      .fill(1)
      .map((n, idx) => {
        const nr = idx + 1;
        return { id: nr, value: nr, text: nr.toString() };
      });

  renderNumericAnswer = question => (
    <div className={cx('Count')} data-question={question}>
      <Dropdown
        wide
        data-part="count-dropdown"
        triggerClassName={cx('dropdown')}
        items={this.getDropdownItems(this.props.question.getMaxQuantity)}
        placeholder={trans('QUANTITY', 'Quantity')}
        onChange={({ value }) => this.props.question.setFollowupAnswer(value)}
        value={this.props.question.getFollowupAnswer}
      />
    </div>
  );

  renderBinaryAnswer = question => (
    <div className={cx('Binary')} data-question={question}>
      <SelectionGroup
        items={selectionGroupItems}
        onChange={({ ids }) => {
          this.props.question.setPrimaryAnswer(ids[0]);
        }}
        textField="text"
        valueField="value"
        value={this.props.question.getPrimaryAnswer}
        type="radio"
        pickType={PickType.RADIO}
      />
    </div>
  );

  renderAnswer = (answerType, question) => {
    switch (answerType) {
      case 'count':
        return this.renderNumericAnswer(question);
      case 'binary':
      default:
        return this.renderBinaryAnswer(question);
    }
  };

  renderURL = urlMatches => (
    <span>
      <a href={urlMatches[2]} target="_blank" rel="noopener noreferrer">
        {urlMatches[1]}
      </a>
    </span>
  );

  renderDescription = description => {
    const urlRegex = new RegExp('\\[(.*)\\]\\((.*)\\)');
    const urlMatches = description.match(urlRegex);
    if (urlMatches) {
      const split = description.split(urlMatches[0]);
      return (
        <T.Caption>
          {split[0]}
          {this.renderURL(urlMatches)}
          {split[1]}
        </T.Caption>
      );
    }

    return <T.Caption>{description}</T.Caption>;
  };

  render() {
    const { question, level = 1, matches } = this.props;
    if (!question || !question.getFollowupQuestion) return <noscript />;
    const primaryQuestion = question.getPrimaryQuestion;
    const primaryQuestionDescription = question.getPrimaryQuestionDescription;
    const level2 = level === 2;
    const indent = level2;

    const [col1, col2] = matches?.small2 ? [6, 3] : [6, 6];

    return (
      <div
        data-question-group={primaryQuestion}
        className={cx('QuestionContainer', { hasFollowUpQuestion: question.getPrimaryAnswer === selectionGroupValues.YES })}>
        {primaryQuestion && (
          <div className={cx('PrimaryQuestion')}>
            <Field wrapperClassName={cx('FieldWrapper', { indent, level2 })} noMinHeight={level2} columns={col1} noMargin inline>
              <T.Caption noMargin>{primaryQuestion}</T.Caption>
            </Field>
            <Field wrapperClassName={cx('FieldWrapper', { level2 })} noMinHeight={level2} columns={col2} inline last noMargin>
              {this.renderAnswer('binary', primaryQuestion)}
            </Field>
          </div>
        )}
        {(!primaryQuestion || question.getPrimaryAnswer === selectionGroupValues.YES) && (
          <div data-follow-up={question.getFollowupQuestion} className={cx('FollowUpQuestion', { level2 })}>
            <Field wrapperClassName={cx('FieldWrapper', { indent: true })} noMargin inline columns={col1}>
              <T.Caption noMargin>{question.getFollowupQuestion}</T.Caption>
            </Field>
            <Field columns={col2} inline last noMargin>
              {this.renderAnswer(question.getTypeOfFollowupQuestion, question.getFollowupQuestion)}
            </Field>
          </div>
        )}
        {primaryQuestionDescription && (
          <Field columns={col2 + col1} inline last noMargin>
            <div className={cx('QuestionDescription')}>{this.renderDescription(primaryQuestionDescription)}</div>
          </Field>
        )}
      </div>
    );
  }
}

export default PrimaryQuestion;
