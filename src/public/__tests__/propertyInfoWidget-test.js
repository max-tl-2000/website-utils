/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

/* eslint-disable global-require */
import { createSandboxDiv, removeSandBoxDiv } from '../../../resources/sandbox';
import { mockWrap } from '../../../resources/mocker';

const { mockModules } = mockWrap(jest);

describe('propertyInfoWidget', () => {
  let createPropertyInfoWidget;
  beforeEach(() => {
    mockModules({
      '../../Website/Stores/WebSiteStore': {
        getWebSiteStore: () => ({}),
      },
      '../../Models/GuestCardModel': {
        GuestCardModel: () => ({}),
      },
    });
    createPropertyInfoWidget = require('../propertyInfoWidget').createPropertyInfoWidget;
  });

  describe('when no selector is provided', () => {
    it('should throw', () => {
      expect(() => createPropertyInfoWidget()).toThrowErrorMatchingSnapshot();
    });
  });

  describe('when the selector is not found in the dom', () => {
    it('should throw and mention the not found selector', () => {
      expect(() => createPropertyInfoWidget('#container')).toThrowErrorMatchingSnapshot();
    });
  });

  describe('when the selector is found but no template is found', () => {
    it('should throw complaining about missing template', () => {
      const { remove } = createSandboxDiv('container');

      expect(() => createPropertyInfoWidget('#container')).toThrowErrorMatchingSnapshot();

      remove();
    });
  });

  describe('when the selector is found and template is found', () => {
    let div;
    beforeEach(() => {
      div = createSandboxDiv('container').div;
    });

    afterEach(() => {
      removeSandBoxDiv('container');
    });

    it('should render the template inside the container and the template should be removed', () => {
      div.innerHTML = `
        <div id="test">
          <script type="text/x-twig">
            <p>Hello world</p>
          </script>
        </div>
      `;
      createPropertyInfoWidget('#test');
      const ele = div.querySelector('#test');
      expect(ele.querySelector('script[type="text/x-twig"]')).toBeNull();
      expect(ele.querySelector('p').innerHTML).toEqual('Hello world');
    });
  });
});
