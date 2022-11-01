/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

import { observable, computed, toJS } from 'mobx';
import { FormModel } from 'mobx-form';
import { isIE11 } from './browserHelper';
import { getFnFromValidator, combineValidators } from './validators';

class DynamicForm extends FormModel {
  @observable
  _fields;

  @observable
  _formId;

  @computed
  get formId() {
    return this._formId;
  }

  constructor(formId, fields = {}) {
    super();

    this._formId = formId;
    const formFields = {
      ...fields,
      _name_: {
        value: 'Mary-Jane Smith',
        meta: {
          type: 'TextBox',
          label: 'Name',
        },
      },
      _userName_: {
        value: '',
        meta: {
          type: 'TextBox',
          label: 'UserName',
        },
      },
    };

    this._fields = this.expandValidators(formFields);
    this.addFields(isIE11 ? toJS(this._fields) : this._fields);
  }

  doExpandValidators = validators => {
    const fns = validators.map(val => getFnFromValidator(val));
    return combineValidators(fns);
  };

  expandValidators = (descriptors = {}) =>
    Object.keys(descriptors).reduce((acc, name) => {
      const { validators = [], ...rest } = descriptors[name];
      const validator = this.doExpandValidators(validators);

      return {
        ...acc,
        [name]: {
          validator,
          ...rest,
        },
      };
    }, {});
}

export const createDynamicForm = (formId, fields) => new DynamicForm(formId, fields);
