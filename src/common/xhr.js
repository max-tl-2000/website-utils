/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

import { window } from './globals';
import { deferred } from './deferred';

export const xhrSend = (url, options = {}) => {
  const opts = {
    method: 'GET',
    async: true,
    data: undefined,
    responseType: 'text',
    uploadProgress: undefined,
    downloadProgress: undefined,
    user: undefined,
    password: undefined,
    autoSend: true,
    ...options,
  };

  const dfd = deferred();

  if (!url) {
    throw new Error('MISSING URL');
  }

  const xhr = new window.XMLHttpRequest();

  xhr.open(opts.method, url, opts.async, opts.user, opts.password);

  if (opts.xhrFields) {
    Object.keys(opts.xhrFields).forEach(key => {
      xhr[key] = opts.xhrFields[key];
    });
  }

  // Override mime type if needed
  if (opts.mimeType && xhr.overrideMimeType) {
    xhr.overrideMimeType(opts.mimeType);
  }

  const headers = opts.headers || {};

  if (!opts.crossDomain && !headers['X-Requested-With']) {
    headers['X-Requested-With'] = 'XMLHttpRequest';
  }

  Object.keys(headers).forEach(key => {
    xhr.setRequestHeader(key, headers[key]);
  });

  xhr.responseType = opts.responseType;

  dfd.resolver = sender => {
    dfd.resolve({
      sender,
      response: sender.response,
      status: sender.status,
    });
  };

  xhr.onload = () => {
    const { status } = xhr;
    if ((status >= 200 && status < 300) || status === 304) {
      dfd.resolver(xhr);
      return;
    }

    dfd.reject(xhr);
  };

  xhr.onerror = e => dfd.reject({ error: e, sender: xhr });

  dfd.abort = () => {
    try {
      xhr && xhr.abort();
    } catch (err) {
      console.warn('error aborting xhr request', err);
    }
  };

  const send = () => xhr.send(opts.data);

  dfd.send = send;

  if (opts.autoSend) {
    send();
  }

  dfd.getXHR = () => xhr;

  return dfd;
};
