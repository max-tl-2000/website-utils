/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

import { serializeParams, combineWithParams } from '../serialize';
describe('serialize', () => {
  describe('serializeParams', () => {
    describe('when an object is passed', () => {
      it('should serialize it as key=value&key2=value2', () => {
        const str = serializeParams({ foo: 'foo', bar: 'bar' });
        expect(str).toEqual('bar=bar&foo=foo');
      });

      it('should handle object with arrays as key values', () => {
        const str = serializeParams({ arr: ['foo', 'baz', 'boo'], bar: 'bar' });
        expect(str).toEqual('arr[]=foo&arr[]=baz&arr[]=boo&bar=bar');
      });
    });
  });

  describe('combineWithParams', () => {
    describe('when the url only contains the domain', () => {
      it('should combine the url with the params forming a valid url', () => {
        const url = 'https://somedomain.com/path';
        const params = serializeParams({ foo: 'bar', bar: 'foo' });

        const result = combineWithParams(url, params);

        expect(result).toEqual('https://somedomain.com/path?bar=foo&foo=bar');
      });
      it('should combine the url with the params forming a valid url when it ends in a trailing slash', () => {
        const url = 'https://somedomain.com/path/';
        const params = serializeParams({ foo: 'bar', bar: 'foo' });

        const result = combineWithParams(url, params);

        expect(result).toEqual('https://somedomain.com/path/?bar=foo&foo=bar');
      });

      it('should combine the url with no pathname with the params as object forming a valid url', () => {
        const url = 'https://somedomain.com';
        const params = { foo: 'bar', bar: 'foo' };

        const result = combineWithParams(url, params);

        expect(result).toEqual('https://somedomain.com?bar=foo&foo=bar');
      });

      it('should combine the url with no pathname with the params as object forming a valid url when it ends in trailing slash', () => {
        const url = 'https://somedomain.com/';
        const params = { foo: 'bar', bar: 'foo' };

        const result = combineWithParams(url, params);

        expect(result).toEqual('https://somedomain.com/?bar=foo&foo=bar');
      });
    });

    describe('when the url contains existing query parameters', () => {
      it('should combine the url with the params forming a valid url', () => {
        const url = 'https://somedomain.com/path?some=help';
        const params = serializeParams({ foo: 'bar', bar: 'foo' });

        const result = combineWithParams(url, params);

        expect(result).toEqual('https://somedomain.com/path?bar=foo&foo=bar&some=help');
      });
    });

    describe('when the url contains a parameter without value', () => {
      it('should combine the url with the params forming a valid url', () => {
        const url = 'https://somedomain.com/path?some';
        const params = serializeParams({ foo: 'bar', bar: 'foo' });

        const result = combineWithParams(url, params);

        expect(result).toEqual('https://somedomain.com/path?bar=foo&foo=bar&some');
      });
    });

    describe('when the url contains a hash', () => {
      it('should combine the url with the params forming a valid url', () => {
        const url = 'https://somedomain.com/path?some#paramExtra';
        const params = serializeParams({ foo: 'bar', bar: 'foo' });

        const result = combineWithParams(url, params);

        expect(result).toEqual('https://somedomain.com/path?bar=foo&foo=bar&some#paramExtra');
      });
    });

    describe('option `processOriginalQueryParams`', () => {
      describe('when some params have to be removed from the url before combining it with the new page state but ignore others', () => {
        it('should keep the non affected params but remove the ones provided to processOriginalQueryParams', () => {
          const url = 'https://somedomain.com/path?some=param&foo=bar#paramExtra';
          const params = { foo: undefined, bar: 'foo' };

          const result = combineWithParams(url, params, {
            processOriginalQueryParams: _params => {
              // we can remove foo by just ignoring it here this is important because as the new params
              // provided above we don't want to include foo as it is undefined but if we don't remove it from
              // here combine params won't know that it has to remove it, it will simply not copy it over
              // the final url which will result in a url with a stale parameter
              const { foo, bar, ...rest } = _params;
              return rest;
            },
          });

          expect(result).toEqual('https://somedomain.com/path?bar=foo&some=param#paramExtra');
        });
      });
    });
  });
});
