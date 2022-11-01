/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

import { action, observable, computed } from 'mobx';
import uuid from 'uuid/v4';
import QuestionSectionModel from './QuestionSectionModel';

export default class QuestionsPageModel {
  _id;

  @observable
  _sectionModels;

  constructor(questions) {
    this._id = uuid();
    this._questions = questions;
    this._sectionModels = this.createSectionModels();
  }

  @computed
  get questions() {
    return this._questions;
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
  get getSectionModels() {
    return this._sectionModels || [];
  }

  createSectionModels() {
    const sectionQuestions = [];
    this.questions.forEach(q => {
      const sectionQuestion = q.displaySectionQuestion;
      if (sectionQuestion && !sectionQuestions.includes(sectionQuestion)) sectionQuestions.push(sectionQuestion);
    });

    const questionsGroupedBySection = sectionQuestions.map(sq => {
      const questionGroup = this.questions.filter(q => q.displaySectionQuestion === sq);
      return new QuestionSectionModel(questionGroup);
    });

    const questionsWithoutSection = this.questions.filter(q => !q.displaySectionQuestion).map(q => new QuestionSectionModel([q]));

    const models = [...questionsGroupedBySection, ...questionsWithoutSection];

    const getSortQuestion = a => a.getSectionQuestion || a.getPrimaryQuestions[0].getPrimaryQuestion;
    return models.sort((a, b) =>
      a.getDisplayOrder === b.getDisplayOrder ? getSortQuestion(a).localeCompare(getSortQuestion(b)) : a.getDisplayOrder - b.getDisplayOrder,
    );
  }
}
