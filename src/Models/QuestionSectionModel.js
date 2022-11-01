/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

import { action, observable, computed } from 'mobx';
import uuid from 'uuid/v4';
import PrimaryQuestionModel from './PrimaryQuestionModel';

export default class QuestionSectionModel {
  _id;

  _primaryQuestions;

  @observable
  _sectionQuestion;

  @observable
  _sectionAnswer;

  @observable
  _displayOrder;

  constructor(questions) {
    this._id = uuid();
    this._primaryQuestions = questions
      .map(q => new PrimaryQuestionModel(q))
      .sort((a, b) =>
        a.getDisplayOrder === b.getDisplayOrder ? a.getPrimaryQuestion.localeCompare(b.getPrimaryQuestion) : a.getDisplayOrder - b.getDisplayOrder,
      );
    this._sectionAnswer = false;

    if (this._primaryQuestions) this._sectionQuestion = this._primaryQuestions[0].getSectionQuestion;
  }

  @computed
  get getId() {
    return this._id;
  }

  @action
  setSectionAnswer(answer) {
    this._sectionAnswer = answer;
  }

  @computed
  get getSectionAnswer() {
    return this._sectionAnswer;
  }

  @computed
  get getSectionQuestion() {
    return this._sectionQuestion || '';
  }

  @computed
  get getPrimaryQuestions() {
    return this._primaryQuestions || [];
  }

  @computed
  get getDisplayOrder() {
    return Math.min(...this.getPrimaryQuestions.map(pq => pq.getDisplayOrder));
  }
}
