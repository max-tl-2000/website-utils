/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

import { formatPhoneNumber } from '../phone-helper';

describe('Given a call to formatPhoneNumber function', () => {
  const notPossibleNumber = '1982893789';
  const numberWithLetters = '888452105A';
  const numberWithSymbols = '888452105@';
  const invalid = '';

  it('should return empty for empty input', () => {
    const res = formatPhoneNumber(' ');
    expect(res).toEqual(invalid);
  });

  it('it should return empty for invalid phone number', () => {
    const res = formatPhoneNumber(notPossibleNumber);
    expect(res).toEqual(invalid);
  });

  it('it should return empty for letters in input', () => {
    const res = formatPhoneNumber(numberWithLetters);
    expect(res).toEqual(invalid);
  });

  it('it should return empty for symbols in input', () => {
    const res = formatPhoneNumber(numberWithSymbols);
    expect(res).toEqual(invalid);
  });
});

describe('when input is a valid phone number', () => {
  describe('with no country code', () => {
    it('should return the number normalized, and defaulted to US', () => {
      const res = formatPhoneNumber('888-452-1505');
      expect(res).toEqual('+18884521505');
    });
  });

  describe('prefixed with US country code', () => {
    it('should return the number normalized, with correct country', () => {
      const res = formatPhoneNumber('1 888-452-1501');
      expect(res).toEqual('+18884521501');
    });
  });

  describe('prefixed with + and US country code', () => {
    it('should return the number normalized, with correct country', () => {
      const res = formatPhoneNumber('+1 888-452-1501');
      expect(res).toEqual('+18884521501');
    });
  });

  describe('prefixed with 00 and US country code', () => {
    it('should return the number normalized, with correct country', () => {
      const res = formatPhoneNumber('001 888-452-1501');
      expect(res).toEqual('+18884521501');
    });
  });

  describe('prefixed with + and a non-US country code', () => {
    it('should return the number normalized, with correct country', () => {
      const res = formatPhoneNumber('+40745518262');
      expect(res).toEqual('+40745518262');
    });
  });

  describe('prefixed with a non-US country code, without +', () => {
    it('should return the number normalized, with correct country', () => {
      const res = formatPhoneNumber('40745518262');
      expect(res).toEqual('+40745518262');
    });
  });

  describe('prefixed with 00 and a non-US counrty code', () => {
    it('should return the number normailzed, with correct country', () => {
      const res = formatPhoneNumber('0040745518262');
      expect(res).toEqual('+40745518262');
    });
  });

  describe('from a country outside US but which matches a US number without the 1 prefix', () => {
    it('should return the number normailzed, with country set to US', () => {
      const res = formatPhoneNumber('8884521505');
      expect(res).toEqual('+18884521505');
    });
  });
});
