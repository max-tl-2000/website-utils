/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

import React, { Component } from 'react';
import { observer } from 'mobx-react';
import ShareLinkDialog from '../ShareLink/ShareLinkDialog';
import { DialogModel } from '../../../common/DialogModel';
import IconButton from '../../../components/IconButton/IconButton';
import ShareIcon from '../../../resources/svgs/ShareIcon.svg';

@observer
export default class ShareLinkDialogContainer extends Component {
  constructor(props) {
    super(props);
    this.dlgModel = new DialogModel();
  }

  render() {
    const { dlgModel, props } = this;
    const { label } = props;
    return (
      <>
        <IconButton type="flat" iconOnLeft label={label} onClick={dlgModel.open} icon={ShareIcon} />
        <ShareLinkDialog open={dlgModel.isOpen} onCloseRequest={dlgModel.close} />
      </>
    );
  }
}
