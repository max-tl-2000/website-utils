/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import Button from '../../../components/Button/Button';
import { navigateTo } from '../../helpers/navigator';
import { combineWithParams } from '../../../common/serialize';

@inject('webSiteStore')
@observer
export class ResidentLauncher extends Component {
  handleClick = () => {
    const { currentPropertyId: propertyId, residentServerURL, tenantName } = this.props.webSiteStore;

    navigateTo(combineWithParams(residentServerURL, { propertyId, tenantName }));
  };

  render() {
    return <Button label="Open Resident experience" onClick={this.handleClick} />;
  }
}
