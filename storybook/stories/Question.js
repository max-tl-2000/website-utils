/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

import React, { Component } from 'react';
import { storiesOf } from '@storybook/react';
import { observer } from 'mobx-react';
import { ResizableContainer } from '../helpers/ResizableHelper';
import Block from '../helpers/Block';
import PrimaryQuestion from '../../src/Website/Containers/InventoryDialog/PersonalizedPrice/PrimaryQuestion';
import PrimaryQuestionModel from '../../src/Models/PrimaryQuestionModel';
import QuestionSectionModel from '../../src/Models/QuestionSectionModel';
import QuestionSection from '../../src/Website/Containers/InventoryDialog/PersonalizedPrice/QuestionSection';

const sectionQuestion1 = 'Do you need additional drinks?';

const sectionQuestion2 = 'Do you need additional food?';

const sectionData = [
  {
    id: 'e0ac3444-c87c-4b99-918a-492960c13eb1',
    name: 'parking',
    displaySectionQuestion: sectionQuestion1,
    displayPrimaryQuestion: 'Do you need additional beers?',
    displayPrimaryQuestionDescription: '',
    displayFollowupQuestion: 'How many beers do you need?',
    inputTypeForFollowupQuestion: 'count',
  },
  {
    id: '80d479b8-9d49-4e51-a2e0-074d5b709a21',
    name: 'pet',
    displaySectionQuestion: sectionQuestion1,
    displayPrimaryQuestion: 'Do you need additional whiskey?',
    displayPrimaryQuestionDescription: '',
    displayFollowupQuestion: 'How many whiskeys do you need?',
    inputTypeForFollowupQuestion: 'count',
  },
  {
    id: '45ac0818-99e1-43cc-9598-be4e03f486fd',
    name: 'storage',
    displaySectionQuestion: sectionQuestion1,
    displayPrimaryQuestion: 'Do you need additional rum?',
    displayPrimaryQuestionDescription: '',
    displayFollowupQuestion: 'How many rums do you need?',
    inputTypeForFollowupQuestion: 'count',
  },
  {
    id: '80d479b8-9d49-4e51-a2e0-074d5b709a21',
    name: 'pet',
    displaySectionQuestion: sectionQuestion2,
    displayPrimaryQuestion: 'Do you need additional potatos?',
    displayPrimaryQuestionDescription: '',
    displayFollowupQuestion: 'How many potatos do you need?',
    inputTypeForFollowupQuestion: 'count',
  },
  {
    id: '45ac0818-99e1-43cc-9598-be4e03f486fd',
    name: 'storage',
    displaySectionQuestion: sectionQuestion2,
    displayPrimaryQuestion: 'Do you need additional cheeses?',
    displayPrimaryQuestionDescription: '',
    displayFollowupQuestion: 'How many cheeses do you need?',
    inputTypeForFollowupQuestion: 'count',
  },
  {
    id: '45ac0818-99e1-43cc-9598-be4e03f486fd',
    name: 'storage',
    displaySectionQuestion: '',
    displayPrimaryQuestion: '',
    displayPrimaryQuestionDescription: '',
    displayFollowupQuestion: 'How many cheeses do you need?',
    inputTypeForFollowupQuestion: 'count',
  },
];

const data = [
  {
    id: 'e0ac3444-c87c-4b99-918a-492960c13eb1',
    name: 'parking',
    displaySectionQuestion: '',
    displayPrimaryQuestion: 'Do you need additional parking?',
    displayPrimaryQuestionDescription: '',
    displayFollowupQuestion: 'How many parking spots do you need?',
    inputTypeForFollowupQuestion: 'count',
  },
  {
    id: '80d479b8-9d49-4e51-a2e0-074d5b709a21',
    name: 'pet',
    displaySectionQuestion: '',
    displayPrimaryQuestion: 'Do you have pets',
    displayPrimaryQuestionDescription:
      'We have restrictions on certain breeds, please review our [PET POLICY](/pet-policy/) to learn more. Service animals are welcomed in our community.',
    displayFollowupQuestion: 'How many pets do you have?',
    inputTypeForFollowupQuestion: 'count',
  },
  {
    id: '45ac0818-99e1-43cc-9598-be4e03f486fd',
    name: 'storage',
    displaySectionQuestion: '',
    displayPrimaryQuestion: 'Do you need additional storage?',
    displayPrimaryQuestionDescription: '',
    displayFollowupQuestion: 'How many storage units do you need?',
    inputTypeForFollowupQuestion: 'count',
  },
];

@observer
class PrimaryQuestionWrapper extends Component {
  questionModel1 = new PrimaryQuestionModel(data[0]);

  questionModel2 = new PrimaryQuestionModel(data[1]);

  questionModel3 = new PrimaryQuestionModel(data[2]);

  render() {
    const { wrapperSize = '100%' } = this.props;

    return (
      <Block>
        <div style={{ width: wrapperSize }}>
          <ResizableContainer width={600} height={400}>
            <PrimaryQuestion question={this.questionModel1} />
            <PrimaryQuestion question={this.questionModel2} />
            <PrimaryQuestion question={this.questionModel3} />
          </ResizableContainer>
        </div>
      </Block>
    );
  }
}

@observer
class QuestionSectionWrapper extends Component {
  model1 = new QuestionSectionModel(sectionData.filter(s => s.displaySectionQuestion === sectionQuestion1));

  model2 = new QuestionSectionModel(sectionData.filter(s => s.displaySectionQuestion === sectionQuestion2));

  model3 = new QuestionSectionModel(sectionData.filter(s => s.displaySectionQuestion === ''));

  render() {
    const { wrapperSize = '73%' } = this.props;

    return (
      <Block>
        <div style={{ width: wrapperSize }}>
          <ResizableContainer width={600} height={400}>
            <QuestionSection sectionModel={this.model1} />
            <QuestionSection sectionModel={this.model2} />
            <QuestionSection sectionModel={this.model3} />
          </ResizableContainer>
        </div>
      </Block>
    );
  }
}

storiesOf('Question containers', module)
  .add('PrimaryQuestion', () => <PrimaryQuestionWrapper />)
  .add('QuestionSection', () => <QuestionSectionWrapper />);
