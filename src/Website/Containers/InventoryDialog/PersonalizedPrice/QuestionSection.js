/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

import React, { Component } from 'react';
import { observer } from 'mobx-react';
import classNames from 'classnames/bind';
import styles from './QuestionSection.scss';
import { trans } from '../../../../common/trans';
import PrimaryQuestion from './PrimaryQuestion';
import SelectionGroup from '../../../../components/SelectionGroup/SelectionGroup';
import Field from '../../../../components/Field/Field';
import * as T from '../../../../components/Typography/Typopgraphy';
import { PickType } from '../../../../components/PickBox/PickBox';

const cx = classNames.bind(styles);

@observer
class QuestionSection extends Component {
  selectionGroupValues = {
    YES: 'YES',
    NO: 'NO',
  };

  binaryItems = [
    { id: 1, text: trans('YES', 'Yes'), value: this.selectionGroupValues.YES },
    { id: 2, text: trans('NO', 'No'), value: this.selectionGroupValues.NO },
  ];

  renderAnswer = sectionQuestion => (
    <div className={cx('Binary')} data-question={sectionQuestion}>
      <SelectionGroup
        items={this.binaryItems}
        onChange={({ ids }) => {
          this.props.sectionModel.setSectionAnswer(ids[0]);
        }}
        textField="text"
        valueField="value"
        value={this.props.sectionModel.getSectionAnswer}
        type="radio"
        pickType={PickType.RADIO}
      />
    </div>
  );

  render() {
    const { sectionModel, matches } = this.props;
    const questions = sectionModel.getPrimaryQuestions;
    const sectionAnswer = sectionModel.getSectionAnswer;
    const sectionQuestion = questions[0].getSectionQuestion;

    const [col1, col2] = matches?.small2 ? [6, 3] : [6, 6];

    return (
      <div key={sectionModel.getId} className={cx('SectionContainer')} data-question-group={sectionQuestion} data-id="marketingQuestionContainer">
        {sectionQuestion && (
          <div className={cx('PrimaryQuestion')}>
            <Field columns={col1} noMargin inline>
              <T.Caption noMargin>{sectionQuestion}</T.Caption>
            </Field>
            <Field columns={col2} last noMargin inline>
              {this.renderAnswer(sectionQuestion)}
            </Field>
          </div>
        )}
        {(sectionAnswer === this.selectionGroupValues.YES || !sectionQuestion) && (
          <div className={cx('Questions', { level2: !!sectionQuestion })} data-id="primaryStorageQuestionsContainer">
            {questions.map(q => (
              <PrimaryQuestion matches={matches} level={sectionQuestion ? 2 : 1} key={q.getId} question={q} />
            ))}
          </div>
        )}
      </div>
    );
  }
}

export default QuestionSection;
