/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

import fs from 'fs';
import globModule from 'glob';
import thenify from './thenify';

export const glob = thenify(globModule);
export const readFile = thenify(fs.readFile);
export const writeFile = thenify(fs.writeFile);

export const read = (file, opts = { encoding: 'utf8' }) => readFile(file, opts);
