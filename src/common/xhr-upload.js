/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

import { xhrSend } from './xhr';
import nullish from './nullish';
// NOTE: send returns a deferred that can get the xhr object
// so it might not be needed to define this separatedly
// Keeping the code just for future reference
export const send = (url, options) => {
  const opts = {
    autoSend: false,
    ...options,
  };

  const dfd = xhrSend(url, opts);

  const xhr = dfd.getXHR();

  if (opts.downloadProgress) {
    xhr.onprogress = e => {
      if (nullish(e.lengthComputable)) return;
      opts.downloadProgress({
        loaded: e.loaded,
        total: e.total,
        percentage: (e.loaded / e.total) * 100,
        sender: xhr,
      });
    };
  }

  if (opts.uploadProgress && xhr.upload) {
    xhr.upload.onprogress = e => {
      if (nullish(e.lengthComputable)) return;
      opts.uploadProgress({
        loaded: e.loaded,
        total: e.total,
        percentage: (e.loaded / e.total) * 100,
        sender: xhr,
      });
    };
  }

  dfd.send();

  return dfd;
};
