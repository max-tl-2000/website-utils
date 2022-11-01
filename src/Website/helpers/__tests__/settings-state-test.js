/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

import { mockWrap } from '../../../../resources/mocker';
const { mockModules } = mockWrap(jest);

describe('settings-state', () => {
  describe('clearWebSettingsIfHostTokenOrVersionChanged', () => {
    beforeEach(() => jest.resetModules());
    it('should save the parameters host and tokens in localStorage if not previously stored', () => {
      const lsMock = {
        lsSave: jest.fn(),
        lsGet: jest.fn(() => undefined),
        lsClear: jest.fn(),
      };

      mockModules({
        '../../../common/ls': lsMock,
      });

      const { clearWebSettingsIfHostTokenOrVersionChanged } = require('../settings-state'); // eslint-disable-line global-require

      clearWebSettingsIfHostTokenOrVersionChanged({ host: 'aHost', token: 'aToken', version: '100' });

      expect(lsMock.lsSave).toHaveBeenCalledWith('reva_web_settings_parameter_props', { host: 'aHost', token: 'aToken', version: '100' });
    });

    it('should clear the stored settings if the stored host is different from the provided as parameters', () => {
      const lsMock = {
        lsSave: jest.fn(),
        lsGet: jest.fn(() => ({ host: 'a', token: 'aToken', version: 'a' })),
        clearLocalStorage: jest.fn(),
      };

      mockModules({
        '../../../common/ls': lsMock,
      });

      const { clearWebSettingsIfHostTokenOrVersionChanged } = require('../settings-state'); // eslint-disable-line global-require

      clearWebSettingsIfHostTokenOrVersionChanged({ host: 'b', token: 'aToken', version: 'a' });

      expect(lsMock.clearLocalStorage).toHaveBeenCalled();
      expect(lsMock.lsSave).toHaveBeenCalledWith('reva_web_settings_parameter_props', { host: 'b', token: 'aToken', version: 'a' });
    });

    it('should clear the stored settings if the stored token is different from the provided as parameters', () => {
      const lsMock = {
        lsSave: jest.fn(),
        lsGet: jest.fn(() => ({ host: 'a', token: 'aToken', version: 'a' })),
        clearLocalStorage: jest.fn(),
      };

      mockModules({
        '../../../common/ls': lsMock,
      });

      const { clearWebSettingsIfHostTokenOrVersionChanged } = require('../settings-state'); // eslint-disable-line global-require

      clearWebSettingsIfHostTokenOrVersionChanged({ host: 'a', token: 'bToken', version: 'a' });

      expect(lsMock.clearLocalStorage).toHaveBeenCalled();
      expect(lsMock.lsSave).toHaveBeenCalledWith('reva_web_settings_parameter_props', { host: 'a', token: 'bToken', version: 'a' });
    });

    it('should clear the stored settings if the stored version is different from the provided as parameters', () => {
      const lsMock = {
        lsSave: jest.fn(),
        lsGet: jest.fn(() => ({ host: 'a', token: 'aToken', version: 'a' })),
        clearLocalStorage: jest.fn(),
      };

      mockModules({
        '../../../common/ls': lsMock,
      });

      const { clearWebSettingsIfHostTokenOrVersionChanged } = require('../settings-state'); // eslint-disable-line global-require

      clearWebSettingsIfHostTokenOrVersionChanged({ host: 'a', token: 'aToken', version: 'b' });

      expect(lsMock.clearLocalStorage).toHaveBeenCalled();
      expect(lsMock.lsSave).toHaveBeenCalledWith('reva_web_settings_parameter_props', { host: 'a', token: 'aToken', version: 'b' });
    });

    it('should not clear the existing settings if the token, host and version parameters are the same as before', () => {
      const lsMock = {
        lsSave: jest.fn(),
        lsGet: jest.fn(() => ({ host: 'aHost', token: 'aToken', version: '100' })),
        clearLocalStorage: jest.fn(),
      };

      mockModules({
        '../../../common/ls': lsMock,
      });

      const { clearWebSettingsIfHostTokenOrVersionChanged } = require('../settings-state'); // eslint-disable-line global-require

      clearWebSettingsIfHostTokenOrVersionChanged({ host: 'aHost', token: 'aToken', version: '100' });

      expect(lsMock.clearLocalStorage).not.toHaveBeenCalled();
      expect(lsMock.lsSave).not.toHaveBeenCalled();
    });
  });
});
