/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { observable, action } from 'mobx';
import uuid from 'uuid/v4';

import classNames from 'classnames/bind';
import styles from './InventoryDialog.scss';
import { trans } from '../../../common/trans';

import SimpleDialog from '../../../components/SimpleDialog/SimpleDialog';
import ActionBar from '../../Components/ActionBar/ActionBar';
import BookerWidget from '../BookerWidget/BookerWidget';
import * as W from '../../../components/Wizard/Wizard';
import * as T from '../../../components/Typography/Typopgraphy';
import WelcomePage from './WelcomePage/WelcomePage';
import QuestionsPage from './PersonalizedPrice/QuestionsPage';
import TermsPage from './PersonalizedPrice/TermsPage';
import ThankYouPage from './PersonalizedPrice/ThankYouPage';
import InventoryDialogModel from '../../../Models/InventoryDialogModel';
import LightButton from '../../Components/LightButton/LightButton';
import SizeAware from '../../../components/SizeAware/SizeAware';
import UserActivityWarning from '../UserActivity/UserActivityWarning';
import { Events, Categories, Components, SubContexts } from '../../helpers/tracking-helper';

const dialogBreakpoints = [{ xsmall: 0 }, { small1: 420 }, { small2: 640 }, { medium: 720 }];

const cx = classNames.bind(styles);

export const dialogPages = {
  WELCOME_PAGE: 0,
  BOOK_APPOINTMENT_PAGE: 1,
  QUESTIONS_PAGE: 2,
  TERMS_PAGE: 3,
  THANK_YOU_PAGE: 4,
};

@inject(({ webSiteStore, appointmentCreateModel }) => {
  const { screenSizeStore } = webSiteStore || {};
  return {
    webSiteStore,
    appointmentCreateModel,
    screenSizeStore,
  };
})
@observer
export default class InventoryDialog extends Component {
  @observable.shallow
  inventoryStore;

  @observable
  dlgModel;

  @observable
  isOpen;

  @observable
  currentPage;

  @action
  setCurrentPage(currentPage) {
    this.currentPage = currentPage;
  }

  @action
  resetSelectedInventory() {
    this.dlgModel = null;
  }

  constructor(props) {
    super(props);
    this.setCurrentPage(dialogPages.WELCOME_PAGE);
    this.state = {
      stepProps: {},
    };
  }

  @action
  loadInventoryInfo = () => {
    const { webSiteStore, inventoryId } = this.props;
    if (!inventoryId) return;

    this.inventoryStore = webSiteStore?.getInventoryStore(inventoryId);
    this.dlgModel = new InventoryDialogModel(this.inventoryStore, inventoryId);
  };

  componentDidUpdate() {
    const { openAtPage } = this.props;
    if (Object.values(dialogPages).includes(openAtPage)) {
      this.setCurrentPage(openAtPage);
    }
  }

  setTermsMessage = message => {
    const oldStepProps = this.state.stepProps;
    this.setState({ stepProps: { ...oldStepProps, termsMessage: message } });
  };

  handlePersonalizedPriceClick = () => {
    this.setCurrentPage(dialogPages.QUESTIONS_PAGE);

    const { dlgModel, props } = this;
    const { webSiteStore, inventoryId } = props;
    const inventoryName = dlgModel?.inventoryInfo?.fullQualifiedName;

    webSiteStore.notifyEvent(Events.PERSONALIZED_PRICE_BUTTON_CLICK, {
      eventLabel: `${inventoryId}-${inventoryName}`,
      inventoryId,
      inventoryName,
      category: Categories.SALES,
      component: Components.INVENTORY_DIALOG,
      subContext: SubContexts.PERSONALIZED_PRICE,
    });
  };

  handleScheduleTourClick = () => {
    this.setCurrentPage(dialogPages.BOOK_APPOINTMENT_PAGE);

    const { dlgModel, props } = this;
    const { webSiteStore, inventoryId } = props;
    const inventoryName = dlgModel?.inventoryInfo?.inventoryId;

    webSiteStore.notifyEvent(Events.SCHEDULE_TOUR_BUTTON_CLICK, {
      eventLabel: `${inventoryId}-${inventoryName}`,
      inventoryId,
      inventoryName,
      category: Categories.SALES,
      component: Components.INVENTORY_DIALOG,
      subContext: SubContexts.PERSONALIZED_PRICE,
    });
  };

  closeDialogFromWelcome = () => {
    this.closeDialog({ source: 'welcomeStepCancelButton' });
  };

  welcomeStep = {
    title: () => {
      const { dlgModel } = this;

      if (!dlgModel || dlgModel?.loading) {
        return trans('LOADING', 'Loading...');
      }

      const title = dlgModel?.error
        ? trans('FAILED_TO_LOAD_UNIT', 'Failed to load unit')
        : trans('PERFECT_APT', 'Get Your Apartment {{name}}', { name: dlgModel?.buildingQualifiedName });
      return title;
    },
    id: uuid(),
    backAction: this.closeDialogFromWelcome,
    backLabel: trans('CANCEL', 'Cancel'),
    content: (props, matches) => {
      const wpm = this.dlgModel?.welcomePageModel;
      return (
        <WelcomePage
          dlgModel={this.dlgModel}
          model={wpm}
          matches={matches}
          personalizedPriceClick={this.handlePersonalizedPriceClick}
          scheduleTourClick={this.handleScheduleTourClick}
          enableScheduleTour={props.enableScheduleTour}
        />
      );
    },
  };

  bookAppointmentStep = {
    id: uuid(),
    content: (props, matches) => {
      const qualifiedName = this.dlgModel?.buildingQualifiedName;
      return (
        <BookerWidget
          matches={matches}
          onBack={!this.props.hideBackButton && this.goToWelcomePage}
          closeDialog={this.closeDialog}
          useCustomizedStyle
          buildingQualifiedName={qualifiedName}
        />
      );
    },
  };

  questionsStep = {
    title: () => trans('PERFECT_APT', 'Get Your Apartment {{name}}', { name: this.dlgModel?.buildingQualifiedName }),
    id: uuid(),
    backAction: () => this.setCurrentPage(dialogPages.WELCOME_PAGE),
    nextAction: async model => {
      const form = model.form;
      if (form) {
        await form.validate();
        if (form.valid) {
          this.dlgModel?.setMoveInDate(form.serializedData.moveInDate);
          await this.dlgModel?.loadInventoryPricing();
          this.dlgModel?.updateStore(form.serializedData);
          if (this.dlgModel?.loadInventoryPricingError) {
            this.setCurrentPage(dialogPages.THANK_YOU_PAGE);
          } else {
            this.setCurrentPage(dialogPages.TERMS_PAGE);
          }
        }
      }
    },
    content: (props, matches) => (
      <div className={cx('questions-container')}>
        <QuestionsPage
          matches={matches}
          questionsPageModel={this.dlgModel?.questionsPageModel}
          guestCardModel={this.dlgModel?.guestCardModel}
          name={this.dlgModel?.name}
        />
      </div>
    ),
  };

  termsStep = {
    id: uuid(),
    title: () => trans('PERFECT_APT', 'Get Your Apartment {{name}}', { name: this.dlgModel?.buildingQualifiedName }),
    content: (stepProps, matches) => {
      const { selfServeAllowExpandLeaseLengthsForUnits } = this.props;

      return (
        <div className={cx('questions-container')}>
          <UserActivityWarning />
          <TermsPage
            selfServeAllowExpandLeaseLengthsForUnits={selfServeAllowExpandLeaseLengthsForUnits}
            matches={matches}
            termsModel={this.dlgModel?.termsModel}
            validationMessage={stepProps?.termsMessage}
            className={cx('noMargin')}
          />
        </div>
      );
    },
    nextAction: async () => {
      const selectedTerm = this.dlgModel.termLength;
      if (!selectedTerm) {
        this.setTermsMessage(trans('SELECT_A_TERM', 'You must select a lease term!'));
        return;
      }

      this.setTermsMessage('');
      const { webSiteStore } = this.props;
      webSiteStore && webSiteStore.enableTrackUserActivity(true);
      await this.dlgModel.submitSelections();

      if (this.dlgModel.requestQuoteError) {
        // TODO: Handle submission error when for some reason we are not able to submit this info
        this.setCurrentPage(dialogPages.THANK_YOU_PAGE);
        return;
      }

      webSiteStore.notifyEvent(Events.WEB_INQUIRY, {
        eventLabel: 'quote',
        category: Categories.USER_ACTION,
        component: Components.INVENTORY_DIALOG,
      });

      this.setCurrentPage(dialogPages.THANK_YOU_PAGE);
    },
    nextLabel: trans('SEND_IT_TO_ME', 'Send it to me'),
    backAction: () => this.setCurrentPage(dialogPages.QUESTIONS_PAGE),
  };

  thankYouStep = {
    id: uuid(),
    content: (props, matches) => <ThankYouPage matches={matches} closeDialog={this.closeDialog} error={this.dlgModel?.error} />,
  };

  dialogSteps = [this.welcomeStep, this.bookAppointmentStep, this.questionsStep, this.termsStep, this.thankYouStep];

  goToWelcomePage = () => this.setCurrentPage(dialogPages.WELCOME_PAGE);

  closeDialog = ({ source } = {}) => {
    const { onCloseRequest } = this.props;
    onCloseRequest && onCloseRequest({ source });

    if (!source) {
      return;
    }

    const { dlgModel, props } = this;
    const { webSiteStore, inventoryId } = props;
    const inventoryName = dlgModel?.inventoryInfo?.inventoryId;

    webSiteStore.notifyEvent(Events.CLOSE_DIALOG, {
      eventLabel: source,
      inventoryId,
      inventoryName,
      category: Categories.SALES,
      component: Components.INVENTORY_DIALOG,
    });
  };

  @action
  resetState = () => {
    const { appointmentCreateModel, onClosed } = this.props;
    onClosed && onClosed({ dialogHasError: this.dlgModel?.error });
    this.resetSelectedInventory();
    const { contactFormModel } = appointmentCreateModel;
    appointmentCreateModel.moveToBeginning();
    contactFormModel.restoreInitialValues();
    this.setCurrentPage(dialogPages.WELCOME_PAGE);
  };

  handleOpen = () => {
    const { inventoryId } = this.props;

    if (inventoryId) {
      this.loadInventoryInfo();
    }
  };

  render() {
    const { currentPage, props } = this;
    const { isOpen } = props;
    const { stepProps } = this.state;

    const showCloseAction = !props.screenSizeStore?.matchSmall1;

    return (
      <SimpleDialog
        open={isOpen}
        onOpen={this.handleOpen}
        showCloseAction={showCloseAction}
        closeOnEscape
        onCloseRequest={this.closeDialog}
        onClosed={this.resetState}
        renderButton={false}
        dlgBodyClassName={cx('dlgBody')}>
        <W.Wizard index={currentPage} className={cx('Wrapper')}>
          {this.dialogSteps
            .sort(step => step.index)
            .map(step => (
              <W.Step className={cx('WizardStep')} key={step.id} container={false}>
                <SizeAware breakpoints={dialogBreakpoints}>
                  {({ matches }) => {
                    let actionsCount = 0;
                    if (step.backAction) {
                      actionsCount += 1;
                    }
                    if (step.nextAction) {
                      actionsCount += 1;
                    }
                    const hasActions = actionsCount > 0;
                    return (
                      <div className={cx('StepWrapper', matches)} data-id="unitDialogContainer">
                        {step.title && (
                          <div className={cx('Header')} data-id="unitDialogHeader">
                            <T.Header noMargin className={cx('headerText', 'serifFont')}>
                              {step.title()}
                            </T.Header>
                            {step.subtitle && <T.Caption className={cx('subTitle')}>{step.subtitle}</T.Caption>}
                          </div>
                        )}
                        {typeof step.content === 'function' ? step.content({ ...props, ...stepProps }, matches) : step.content}
                        {hasActions && (
                          <ActionBar className={cx('footer')} buttonCount={actionsCount}>
                            {step.backAction && (
                              <LightButton type="flat" btnRole="secondary" label={step.backLabel || trans('BACK', 'back')} onClick={step.backAction} />
                            )}
                            {step.nextAction && (
                              <LightButton
                                type="flat"
                                btnRole="primary"
                                label={step.nextLabel || trans('NEXT', 'next')}
                                onClick={() => step.nextAction(this.dlgModel?.guestCardModel)}
                              />
                            )}
                          </ActionBar>
                        )}
                      </div>
                    );
                  }}
                </SizeAware>
              </W.Step>
            ))}
        </W.Wizard>
      </SimpleDialog>
    );
  }
}
