/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

import nullish from './nullish';

/**
 * Always accepts a string JSON and returns a JSON object
 * If optional arg provided and the string JSON is invalid, optional arg will be returned
 * @param str the string to try to parse
 * @param [defaultObj] optional, the default value to use if parsing fails or is nullish
 * @example
    ```
    const str = '{"some":"some","obj":{"foo":"bar"}}'
    const obj1 = tryParse( str );
    const obj2 = tryParse( str, {} ); // optional arg provided
    ```
 */
export default function tryParse(str, defaultObj) {
  let returnedObj;
  try {
    returnedObj = JSON.parse(str);

    if (nullish(returnedObj)) {
      returnedObj = defaultObj;
    }
  } catch (ex) {
    returnedObj = defaultObj;
  }

  return returnedObj;
}
