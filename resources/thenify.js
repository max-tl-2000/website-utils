/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

export default function thenify(fn, ctx) {
  const wrap = (...args) =>
    new Promise((resolve, reject) => {
      args.push((err, ...rest) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(...rest);
      });
      fn.apply(ctx, args);
    });

  return wrap;
}
