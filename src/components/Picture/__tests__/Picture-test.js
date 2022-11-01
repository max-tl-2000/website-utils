/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

/* eslint-disable global-require */
import React from 'react';

import { render, cleanup } from '@testing-library/react';
import { mockWrap } from '../../../../resources/mocker';
import sleep from '../../../common/sleep';

const { mockModules } = mockWrap(jest);

class ImageMock {
  set src(value) {
    this._src = value;
    this.onload && this.onload();
  }
}

class ImageMockLoading {
  set src(value) {
    this._src = value;
  }
}

class ImageMockError {
  set src(value) {
    this._src = value;
    this.onerror && this.onerror();
  }
}

describe('Picture', () => {
  afterEach(() => {
    jest.resetModules();
    cleanup();
  });

  describe('If no src is provided', () => {
    it('should show the imageFailedText', () => {
      mockModules({
        '../PictureHelper': {
          imgToDataURL: () => 'imageData1',
          Image: ImageMock,
        },
      });

      const Picture = require('../Picture').default;

      const { container } = render(<Picture src="" />);
      expect(container.querySelector('.noImage')).toHaveTextContent('Image not available');
    });
  });

  describe('If src is provided', () => {
    it('should show the loading state while loading the image', () => {
      mockModules({
        '../PictureHelper': {
          imgToDataURL: () => 'imageData2',
          Image: ImageMockLoading,
        },
      });

      const Picture = require('../Picture').default;
      const { container } = render(<Picture src="/img/path.png" />);
      expect(container.firstChild.querySelector('[data-c="loadingBlock"]')).toBeDefined();
    });

    it('should show the image after it has being loaded', async () => {
      mockModules({
        '../PictureHelper': {
          imgToDataURL: () => 'imageData3',
          Image: ImageMock,
        },
      });

      const Picture = require('../Picture').default;
      const { container } = render(<Picture useDataURI src="/img/path.png" />);
      expect(container.firstChild.querySelector('.bg-image')).toBeDefined();
      const DELAY_FOR_IMAGE_BEING_RENDER = 32; // 2 turns of the loop
      await sleep(DELAY_FOR_IMAGE_BEING_RENDER);
      expect(
        container.firstChild
          .querySelector('.bg-image')
          .getAttribute('style')
          .indexOf('background-image: url(imageData3)'),
      ).toBeGreaterThan(-1);
    });

    it('should show the imageFailedText if failed to load', () => {
      mockModules({
        '../PictureHelper': {
          imgToDataURL: () => 'imageData4',
          Image: ImageMockError,
        },
      });

      const Picture = require('../Picture').default;

      const { container } = render(<Picture src="/img/path.png" />);
      expect(container.querySelector('.noImage')).toHaveTextContent('Image not available');
    });
  });
});
