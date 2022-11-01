/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

/* eslint-disable react/prefer-stateless-function */
import React, { Component } from 'react';
import { storiesOf } from '@storybook/react';

import Block from '../helpers/Block';
import { showFormDialogWidget } from '../../src/public/formDialogWidget';

class Wrapper extends Component {
  render() {
    const domain = 'https://cucumber.local.env.reva.tech';
    const token =
      'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJib2R5Ijoie0VOQ1JZUFRFRH06RGdoMXJaRFBTQ3lwTHVtZjpLRHVaL240RG4wUFJQaW5WTExlemVUM0pTSE9nSzBwMlRJZmNhNWQrUXU1am5SZkhxMDRPSHhSSEQwMkdHNWpBMzRrbkN6SlJ2YmtzcTIrMFY4eHlYckp6WDh6UWtTeG5IY3dYY29yYVpjS2ZzSkJSZkdVeWU1MDNjUU1FWmVoUmtlKzF0dU5sOWh0czVUQUtnaFF1L2RQZm9OKytwY2QydGxGaFBpTWlVTHBpejJsTHR4ZlgvMTVxUXB2b0svTjRZN3ZNNmJVYXhxNEthY0k9IiwiaWF0IjoxNTUyOTIwODg1LCJleHAiOjE2MTYwMzYwODV9.CuyOkGdqxHuvi8Kog-Qhc1xbpAADYxwSzklBiZ3X0Og';
    const options = {
      campaignEmail: 'parkmerced',
      extraData: {
        qualificationQuestions: {},
      },
      domain,
      token,
      shouldAllowComments: true,
    };

    return <Block>{showFormDialogWidget(options)}</Block>;
  }
}

storiesOf('ContactForm', module).add('ContactForm', () => <Wrapper />);
