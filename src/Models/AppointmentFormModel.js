/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

import { computed, observable, toJS } from 'mobx';
import { FormModel } from 'mobx-form';
import { trans } from '../common/trans';
import { combineValidators, getFnFromValidator, validateValidEmail, validateValidPhone } from '../common/validators';
import { isIE11 } from '../common/browserHelper';

export default class AppointmentFormModel extends FormModel {
  @computed
  get webSiteStore() {
    return this._webSiteStore;
  }

  @computed
  get name() {
    return this.fields.name;
  }

  @computed
  get email() {
    return this.fields.email;
  }

  @computed
  get mobilePhone() {
    return this.fields.mobilePhone;
  }

  @computed
  get _name_() {
    return this.fields._name_;
  }

  @computed
  get _userName_() {
    return this.fields._userName_;
  }

  @observable
  _dynamicFields;

  @computed
  get dynamicFields() {
    return this._dynamicFields || [];
  }

  doExpandValidators = validators => {
    const fns = validators.map(val => getFnFromValidator(val));
    return combineValidators(fns);
  };

  expandValidators = (descriptors = []) =>
    descriptors.map(descriptor => {
      const { validators = [], ...rest } = descriptor;
      const validator = this.doExpandValidators(validators);

      return {
        validator,
        ...rest,
      };
    });

  syncFromWebSiteStore = () => {
    if (this.webSiteStore) {
      const { fields } = this;
      fields.name.value = this.webSiteStore.fullName;
      fields.email.value = this.webSiteStore.email;
      fields.mobilePhone.value = this.webSiteStore.phoneNo;

      // since this is a field that is added as dynamic it might not exists
      // if the widget is instantiated without the moveInTime
      if (fields.moveInTime) {
        fields.moveInTime.value = this.webSiteStore.moveInTime;
      }
    }
  };

  constructor(dynamicFields, webSiteStore) {
    const initialState = {
      name: '',
      email: '',
      mobilePhone: '',
      _name_: 'Mary-Jane Smith',
      _userName_: '',
    };

    const validators = {
      name: {
        required: trans('NAME_REQUIRED', 'Name is required'),
        interactive: false,
      },
      email: {
        required: trans('EMAIL_REQUIRED', 'Email is required'),
        interactive: false,
        fn: validateValidEmail,
      },
      mobilePhone: {
        interactive: false,
        required: trans('PHONE_REQUIRED', 'Phone is required'),
        fn: validateValidPhone,
      },
    };

    super(initialState, validators);

    this._webSiteStore = webSiteStore;

    if (dynamicFields) {
      this._dynamicFields = this.expandValidators(dynamicFields);
      isIE11 ? this._dynamicFields && this.addFields(toJS(this._dynamicFields)) : this.addFields(this._dynamicFields);
    }
  }
}
