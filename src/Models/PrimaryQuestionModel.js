/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

import { action, observable, computed } from 'mobx';

const DEFAULT_MAX_QUANTITY = 2;
const DEFAULT_DISPLAY_ORDER = 0;

export default class PrimaryQuestionModel {
  @observable
  _sectionQuestion;

  @observable
  _primaryQuestion;

  @observable
  _primaryQuestionDescription;

  @observable
  _followupQuestion;

  @observable
  _inputTypeForFollowupQuestion;

  @observable
  _primaryAnswer;

  @observable
  _followupAnswer;

  @observable
  _maxQuantity;

  @observable
  _displayOrder;

  constructor({
    id,
    name,
    feeId,
    maxQuantity,
    displaySectionQuestion,
    displayPrimaryQuestion,
    displayPrimaryQuestionDescription,
    displayFollowupQuestion,
    inputTypeForFollowupQuestion,
    displayOrder,
  }) {
    this._id = id;
    this._name = name;
    this._feeId = feeId;
    this._maxQuantity = maxQuantity;
    this._sectionQuestion = displaySectionQuestion;
    this._primaryQuestion = displayPrimaryQuestion;
    this._primaryQuestionDescription = displayPrimaryQuestionDescription;
    this._followupQuestion = displayFollowupQuestion;
    this._inputTypeForFollowupQuestion = inputTypeForFollowupQuestion;
    this._primaryAnswer = false;
    this._displayOrder = displayOrder;
  }

  @action
  setPrimaryAnswer(answer) {
    this._primaryAnswer = answer;
  }

  @action
  setFollowupAnswer(answer) {
    this._followupAnswer = answer;
  }

  @computed
  get getId() {
    return this._id || '';
  }

  @computed
  get getFeeId() {
    return this._feeId || '';
  }

  @computed
  get getMaxQuantity() {
    return this._maxQuantity || DEFAULT_MAX_QUANTITY;
  }

  @computed
  get getDisplayOrder() {
    return this._displayOrder || DEFAULT_DISPLAY_ORDER;
  }

  @computed
  get getPrimaryAnswer() {
    return this._primaryAnswer || '';
  }

  @computed
  get getFollowupAnswer() {
    return this._followupAnswer || '';
  }

  @computed
  get getSectionQuestion() {
    return this._sectionQuestion || '';
  }

  @computed
  get getPrimaryQuestion() {
    return this._primaryQuestion || '';
  }

  @computed
  get getPrimaryQuestionDescription() {
    return this._primaryQuestionDescription || '';
  }

  @computed
  get getFollowupQuestion() {
    return this._followupQuestion || '';
  }

  @computed
  get getTypeOfFollowupQuestion() {
    return this._inputTypeForFollowupQuestion || '';
  }
}
