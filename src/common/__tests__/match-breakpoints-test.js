/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

import { matchBreakpoints } from '../match-breakpoints';

describe('match-breakpoints', () => {
  describe('given a set of breakpoints and a width', () => {
    it('should return the appropriated breakpoint for the given width', () => {
      const { currentBreakpoint: brk } = matchBreakpoints({ small: [0, 100], medium: [101, 200], large: [201, Infinity] }, 0);
      expect(brk).toEqual('small');

      const { currentBreakpoint: brk1 } = matchBreakpoints({ small: [0, 100], medium: [101, 200], large: [201, Infinity] }, 101);
      expect(brk1).toEqual('medium');

      const { currentBreakpoint } = matchBreakpoints({ small: [0, 100], medium: [101, 200], large: [201, Infinity] }, 231);
      expect(currentBreakpoint).toEqual('large');
    });

    it('should return an object with the breakpoints as keys and true/false if they match', () => {
      const { matches } = matchBreakpoints({ small: [0, 100], medium: [101, 200], large: [201, Infinity] }, 0);
      expect(matches).toEqual({ small: true, medium: false, large: false });

      const { matches: matches2 } = matchBreakpoints({ small: [0, 100], medium: [101, 200], large: [201, Infinity] }, 150);
      expect(matches2).toEqual({ small: true, medium: true, large: false });

      const { matches: matches3 } = matchBreakpoints({ small: [0, 99], medium: [100, 199], large: [200, Infinity] }, 202);
      expect(matches3).toEqual({ small: true, medium: true, large: true });
    });
  });

  describe('when breakpoints are defined using an array', () => {
    it('should return the appropriated breakpoint for the given width', () => {
      const { currentBreakpoint: brk } = matchBreakpoints([{ small: 0 }, { medium: 100 }, { large: 200 }], 0);
      expect(brk).toEqual('small');

      const { currentBreakpoint: brk1 } = matchBreakpoints([{ small: 0 }, { medium: 100 }, { large: 200 }], 150);
      expect(brk1).toEqual('medium');

      const { currentBreakpoint: brk2 } = matchBreakpoints([{ small: 0 }, { medium: 100 }, { large: 200 }], 250);
      expect(brk2).toEqual('large');
    });

    it('should return an object with the breakpoints as keys and true/false if they match', () => {
      const { matches } = matchBreakpoints([{ small: 0 }, { medium: 100 }, { large: 200 }], 0);
      expect(matches).toEqual({ small: true, medium: false, large: false });

      const { matches: matches2 } = matchBreakpoints([{ small: 0 }, { medium: 100 }, { large: 200 }], 150);
      expect(matches2).toEqual({ small: true, medium: true, large: false });

      const { matches: matches3 } = matchBreakpoints([{ small: 0 }, { medium: 100 }, { large: 200 }], 250);
      expect(matches3).toEqual({ small: true, medium: true, large: true });
    });
  });
});
