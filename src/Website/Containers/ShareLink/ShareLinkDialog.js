/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

import React, { Component } from 'react';
import { observer } from 'mobx-react';
import SimpleDialog from '../../../components/SimpleDialog/SimpleDialog';
import ShareLink from './ShareLink';

@observer
export default class ShareLinkDialog extends Component {
  handleClose = () => {
    const { onCloseRequest } = this.props;
    onCloseRequest && onCloseRequest();
  };

  render() {
    const { open } = this.props;

    return (
      <SimpleDialog open={open} onCloseRequest={this.handleClose} renderButton={false} dataId="shareDialogContainer">
        <ShareLink />
      </SimpleDialog>
    );
  }
}
