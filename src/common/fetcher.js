/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

import { xhrSend } from './xhr';
import { isObject } from './type-of';
import { combineWithParams } from './serialize';
import tryParse from './try-parse';

const parseAsJSONIfNeeded = response => {
  if (typeof response === 'string') {
    response = tryParse(response, { response });
  }

  return response;
};

export const fetch = (url, options) => {
  const opts = {
    method: 'GET',
    autoSend: false,
    responseType: 'json',
    dataAsQueryParams: false,
    rawData: false,
    ...options,
  };

  const { headers, data, ...optsRest } = opts;

  let dataToSend;

  if (isObject(data) && !opts.rawData) {
    if (opts.dataAsQueryParams) {
      url = combineWithParams(url, data);
    } else {
      dataToSend = JSON.stringify(data);
    }
  }

  const dfd = xhrSend(url, { ...optsRest, data: dataToSend, headers: { ...headers, 'Content-Type': 'application/json' } });

  dfd.resolver = async sender => {
    const { onResponse } = opts;
    let res = parseAsJSONIfNeeded(sender.response);
    if (onResponse) {
      res = await onResponse(sender);
    }
    dfd.resolve(res);
  };

  dfd.send();

  return dfd;
};
