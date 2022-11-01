/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

import { getCloudinaryURLForImage } from '../images';

describe('cloudinary', () => {
  it('should wrap the provided url in a cloudinary url', () => {
    const url = 'https://somepath/to/an/image?q=1';
    const result = getCloudinaryURLForImage(url);

    expect(result).toMatchSnapshot();
  });

  describe('when the url is reva api images endpoint', () => {
    it('should return the same url but with the cParams property set', () => {
      const url = 'https://reva.tech/api/images/someOtherParam?q=1';
      const result = getCloudinaryURLForImage(url);

      expect(result).toMatchSnapshot();
    });

    it('if width is set combine it with other params', () => {
      const url = 'https://reva.tech/api/images/someOtherParam?q=1';
      const result = getCloudinaryURLForImage(url, { width: 100 });

      expect(result).toMatchSnapshot();
    });
  });
});
