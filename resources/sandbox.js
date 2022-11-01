/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

export const createSandboxDiv = (id = 'test__Sandbox') => {
  const div = document.createElement('div');
  div.setAttribute('id', id);

  const { body } = document;

  body.appendChild(div);

  return {
    div,
    remove() {
      body.removeChild(div);
    },
  };
};

export const removeSandBoxDiv = (id = 'test__Sandbox') => {
  const div = document.querySelector(`#${id}`);
  div?.parentElement?.removeChild(div);
};
