/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

import React, { Component } from 'react';
import { storiesOf } from '@storybook/react';
import { observer } from 'mobx-react';
import ShareLinkDialog from '../../src/Website/Containers/ShareLink/ShareLinkDialog';
import { DialogModel } from '../../src/common/DialogModel';

@observer
class Wrapper extends Component {
  constructor(props) {
    super(props);
    this.dlg = new DialogModel({ open: props.isOpen });
  }

  handleClose = () => {
    this.dlg.close();
  };

  render() {
    return <ShareLinkDialog url={'http://web.staging.env.reva.tech/71France'} open={this.dlg.isOpen} onCloseRequest={this.handleClose} />;
  }
}

storiesOf('ShareLinkDialogWidget', module).add('ShareLinkDialog', () => <Wrapper isOpen={true} />);
