/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

import { createService, combine } from '../common/service-creator';

export const createFormEndpointsService = ({ domain, endpoints = {}, extraData = {} } = {}) => {
  const service = createService({
    saveForm: {
      method: 'POST',
      url: combine(domain, endpoints.saveForm),
      // we receive mobilePhone from the form but the api expects phone
      data: ({ estimatedMoveIn, expectedTermLength, moveInDate, numberOfPets, ...data }) => {
        const { qualificationQuestions, requestQuote, ...rest } = extraData;

        const ret = {
          ...data,
          ...rest,
          qualificationQuestions: {
            ...qualificationQuestions,
            moveInTime: estimatedMoveIn,
          },
        };

        if (requestQuote) {
          ret.requestQuote = {
            ...requestQuote,
            petCount: numberOfPets,
            termLength: expectedTermLength,
            moveInDate,
          };
        }

        return ret;
      },
      headers: data => ({ 'x-reva-property-id': data?.propertyId }),
    },
  });

  service.getFormData = async () => ({
    numBedrooms: [
      { id: 'STUDIO', value: 'Studio' },
      { id: 'ONE_BED', value: 'One bed' },
      { id: 'TWO_BEDS', value: 'Two beds' },
      { id: 'THREE_BEDS', value: 'Three beds' },
      { id: 'FOUR_PLUS_BEDS', value: 'Four beds' },
    ],
    moveInTime: [
      { id: 'NEXT_4_WEEKS', value: 'Next 4 weeks' },
      { id: 'NEXT_2_MONTHS', value: 'Next 2 months' },
      { id: 'NEXT_4_MONTHS', value: 'Next 4 months' },
      { id: 'BEYOND_4_MONTHS', value: 'Beyond 4 months' },
      { id: 'I_DONT_KNOW', value: "I don't know" },
    ],
    termLengths: Array.from(new Array(13)).map((entry, index) => {
      const id = index + 3;
      return {
        id,
        value: `${id} Months`,
      };
    }),
    timezone: 'America/Los_Angeles',
    petsNumber: [{ id: 0, value: 'No pets' }, { id: 1, value: '1 pet' }, { id: 2, value: '2 pets' }],
  });

  return service;
};
