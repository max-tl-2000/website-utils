/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

export const window = global.window || {};
export const win = window;
export const isNode = () => typeof process !== 'undefined' && (process.release || {}).name === 'node';
export const Date = global.Date;
export const location = win.location;
export const setTimeout = global.setTimeout;
export const document = win.document;
