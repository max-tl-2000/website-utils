/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

import { expand } from './resources/expand';
import { deferred } from './src/common/deferred';
import { read } from './resources/xfs';

const safeRead = async file => {
  try {
    return await read(file);
  } catch (err) {
    return '';
  }
};

const getCSSVarsOnFile = async file => {
  const content = await safeRead(file);
  return Array.from(content.matchAll(/vars?\((.*)\)/g)).reduce((acc, result) => {
    const cssVarsLine = result[1] || '';
    const parts = cssVarsLine
      .split(/,/)
      .map(cssVar => cssVar.trim())
      .filter(entry => entry.match(/^--/));
    acc = acc.concat(parts);
    return acc;
  }, []);
};

export const iterateOverArray = (items = [], args) => {
  const promise = deferred({ id: 'iterateOverArray' });
  const { chunkSize = 10, onChunk } = args;
  const { length } = items;

  const totalGroups = Math.ceil(length / chunkSize);
  let processed = 0;
  let cancelled = false;
  let iterationDone = false;

  const process = () => {
    if (cancelled) {
      return;
    }

    if (processed === totalGroups) {
      iterationDone = true;
      promise.resolve();
      return;
    }

    const from = processed * chunkSize;
    const to = from + chunkSize;
    const arr = items.slice(from, to);

    setTimeout(async () => {
      if (cancelled) return;

      await onChunk?.({ chunk: arr, from, to: to - 1 });

      processed++;
      process();
    });
  };

  process();

  return {
    promise,
    cancel: () => {
      if (iterationDone || cancelled) return;
      cancelled = true;
      promise.resolve();
    },
  };
};

const main = async () => {
  const files = await expand({ patterns: 'src/**/*.scss' });

  let outputSet = [];

  const { promise } = iterateOverArray(files, {
    onChunk: async ({ chunk }) => {
      const promises = chunk.map(file => getCSSVarsOnFile(file));
      const cssVars = await Promise.all(promises);
      outputSet = [...outputSet, ...cssVars.flat(Infinity)];
    },
  });

  await promise;
  console.log('>>> done processing files', Array.from(new Set(outputSet).values()).sort());
};

main().catch(err => console.error('>>> error: ', err));
