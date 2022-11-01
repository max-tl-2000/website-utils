/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

import { formatHours } from '../format';
describe('format', () => {
  describe('formatHours', () => {
    it('should return an empty string if no days hash is provided', () => {
      expect(formatHours({})).toEqual('');
    });

    describe('when all days have the same start and end date', () => {
      it('should just have one office hours group', () => {
        const workingHours = {
          Friday: {
            endTime: '23:58',
            startTime: '00:01',
          },
          Monday: {
            endTime: '23:58',
            startTime: '00:01',
          },
          Sunday: {
            endTime: '23:58',
            startTime: '00:01',
          },
          Tuesday: {
            endTime: '23:58',
            startTime: '00:01',
          },
          Saturday: {
            endTime: '23:58',
            startTime: '00:01',
          },
          Thursday: {
            endTime: '23:58',
            startTime: '00:01',
          },
          Wednesday: {
            endTime: '23:58',
            startTime: '00:01',
          },
        };

        expect(formatHours(workingHours)).toEqual('Mon-Sun 12:01am-11:58pm');
      });
    });

    describe('when there are different working hours ranges per days', () => {
      it('should format the working hours in groups of the same ranges', () => {
        const workingHours = {
          Monday: {
            startTime: '09:00',
            endTime: '18:00',
          },
          Tuesday: {
            startTime: '09:00',
            endTime: '18:00',
          },
          Wednesday: {
            startTime: '09:00',
            endTime: '18:00',
          },
          Thursday: {
            startTime: '10:00',
            endTime: '17:00',
          },
          Friday: {
            startTime: '10:00',
            endTime: '17:00',
          },
          Saturday: {
            startTime: '08:00',
            endTime: '14:30',
          },
          Sunday: {
            startTime: '08:00',
            endTime: '14:30',
          },
        };

        expect(formatHours(workingHours)).toEqual('Mon-Wed 9am-6pm | Thu-Fri 10am-5pm | Sat-Sun 8am-2:30pm');
      });
    });

    describe('when most days have different working hours but some have the same', () => {
      it('should format the working hours in groups of the same ranges', () => {
        const workingHours = {
          Monday: {
            startTime: '09:00',
            endTime: '18:00',
          },
          Tuesday: {
            startTime: '11:00',
            endTime: '15:00',
          },
          Wednesday: {
            startTime: '09:00',
            endTime: '18:00',
          },
          Thursday: {
            startTime: '10:00',
            endTime: '17:00',
          },
          Friday: {
            startTime: '10:00',
            endTime: '17:00',
          },
          Saturday: {
            startTime: '08:00',
            endTime: '14:30',
          },
          Sunday: {
            startTime: '08:00',
            endTime: '14:30',
          },
        };

        expect(formatHours(workingHours)).toEqual('Mon 9am-6pm | Tue 11am-3pm | Wed 9am-6pm | Thu-Fri 10am-5pm | Sat-Sun 8am-2:30pm');
      });

      describe('when some days are missing in the workingHours provided', () => {
        it('should consider the missing days as Closed', () => {
          const workingHours = {
            Tuesday: {
              startTime: '11:00',
              endTime: '15:00',
            },
            Wednesday: {
              startTime: '09:00',
              endTime: '18:00',
            },
            Thursday: {
              startTime: '10:00',
              endTime: '17:00',
            },
            Friday: {
              startTime: '10:00',
              endTime: '17:00',
            },
            Saturday: {
              startTime: '08:00',
              endTime: '14:30',
            },
          };

          expect(formatHours(workingHours)).toEqual('Mon Closed | Tue 11am-3pm | Wed 9am-6pm | Thu-Fri 10am-5pm | Sat 8am-2:30pm | Sun Closed');
        });
      });

      describe('when consecutive days are missing', () => {
        it('should consider the missing days as Closed and group them', () => {
          const workingHours = {
            Monday: {
              startTime: '11:00',
              endTime: '15:00',
            },
            Tuesday: {
              startTime: '11:00',
              endTime: '15:00',
            },
            Wednesday: {
              startTime: '09:00',
              endTime: '18:00',
            },
            Thursday: {
              startTime: '10:00',
              endTime: '17:00',
            },
            Friday: {
              startTime: '10:00',
              endTime: '17:00',
            },
          };

          expect(formatHours(workingHours)).toEqual('Mon-Tue 11am-3pm | Wed 9am-6pm | Thu-Fri 10am-5pm | Sat-Sun Closed');
        });
      });

      describe('when consecutive days have startTime and endTime the same even when different between them', () => {
        it('should consider those days as Closed and group them', () => {
          const workingHours = {
            Monday: {
              startTime: '11:00',
              endTime: '15:00',
            },
            Tuesday: {
              startTime: '11:00',
              endTime: '15:00',
            },
            Wednesday: {
              startTime: '09:00',
              endTime: '18:00',
            },
            Thursday: {
              startTime: '10:00',
              endTime: '17:00',
            },
            Friday: {
              startTime: '10:00',
              endTime: '17:00',
            },
            Saturday: {
              startTime: '00:00',
              endTime: '00:00',
            },
            Sunday: {
              startTime: '01:00',
              endTime: '01:00',
            },
          };

          expect(formatHours(workingHours)).toEqual('Mon-Tue 11am-3pm | Wed 9am-6pm | Thu-Fri 10am-5pm | Sat-Sun Closed');
        });
      });
    });
  });
});
