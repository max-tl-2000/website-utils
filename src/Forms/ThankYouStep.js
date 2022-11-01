/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

import React, { Component } from 'react';
import Button from '../components/Button/Button';
import * as T from '../components/Typography/Typopgraphy';
import * as C from '../components/Card/Card';

export default class ThankYouStep extends Component {
  render() {
    return (
      <C.Card style={{ maxWidth: 500, width: '100%' }}>
        <C.Content container>
          <T.Text style={{ lineHeight: '1.5rem' }}>
            We've sent a link to start your application. Check your email. It only takes a few minutes to complete.
          </T.Text>
          <T.Text style={{ marginTop: 20, lineHeight: '1.5rem' }}>
            If you have questions or need help, give us a call or text us at <a href="tel:+14632222232">(463) 222-2232</a>.
          </T.Text>
        </C.Content>
        <C.Actions container>
          <Button label="Done" onClick={this.props.onDoneClick} />
        </C.Actions>
      </C.Card>
    );
  }
}
