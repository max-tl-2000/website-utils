/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

import React from 'react';
import 'react-resizable/css/styles.css';
import { ResizableBox } from 'react-resizable';
import * as T from '../../src/components/Typography/Typopgraphy';

export const ResizableContainer = ({ children, width = 640, height = 500 }) => (
  <ResizableBox width={width} height={height}>
    <div style={{ width: '100%', height: '100%', position: 'relative', border: '1px dotted #333', padding: 10, overflow: 'hidden' }}>
      {children}
      <T.Caption
        lighterForeground
        uppercase
        style={{ fontSize: 10, position: 'absolute', bottom: 0, right: 10, pointerEvents: 'none', background: '#000', padding: '5px 10px' }}>
        Resize me!
      </T.Caption>
    </div>
  </ResizableBox>
);
