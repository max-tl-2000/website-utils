/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

import React from 'react';
import { observer } from 'mobx-react';
import { isMoment } from 'moment';
import Field from '../components/Field/Field';
import * as T from '../components/Typography/Typopgraphy';

export const NON_VISIBLE_FIELD = { position: 'absolute', top: -99999, left: -99999 };

export const FormField = observer(
  ({
    field,
    fullWidth,
    fieldNoMargin = true,
    Component,
    columns,
    onBlur,
    fieldInline,
    fieldLast,
    fieldStyle,
    fieldClassName,
    alignRightErrorMsg,
    showLabel,
    label,
    componentLabel,
    ...rest
  }) => (
    <Field
      noMargin={fieldNoMargin}
      className={fieldClassName}
      columns={!fullWidth && columns}
      style={{ ...fieldStyle, marginBottom: '.825rem' }}
      inline={fieldInline}
      last={fieldLast}
      fullWidth={fullWidth}>
      {showLabel && <T.Caption secondary>{label}</T.Caption>}
      <Component
        lighterPlaceholder={showLabel}
        value={field.value}
        label={componentLabel}
        error={!fieldInline && field.errorMessage}
        onBlur={e => {
          field.validate(true);
          onBlur && onBlur(e);
        }}
        alignRightErrorMsg={alignRightErrorMsg}
        onChange={value => {
          const formattedValue = isMoment(value) ? value : value?.value;
          field.setValue(formattedValue);
        }}
        wide
        {...rest}
      />
    </Field>
  ),
);
