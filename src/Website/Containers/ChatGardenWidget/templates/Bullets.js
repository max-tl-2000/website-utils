/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

'use strict';

import { observer } from 'mobx-react';
import React, { Component } from 'react';

@observer
export class BulletsChat extends Component {
  render() {
    const { bullets } = this.props;

    return (
      <ul className="rw_ch_amenities" style={{ gridTemplateColumns: 'repeat(2, 180px)', marginTop: 12, marginBottom: 12 }}>
        {bullets.map(bullet => (
          <li>{bullet.displayText}</li>
        ))}
      </ul>
    );
  }
}
