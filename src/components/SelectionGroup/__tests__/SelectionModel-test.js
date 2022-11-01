/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

import SelectionModel from '../SelectionModel';

describe('SelectionModel', () => {
  const lifestyles = [
    {
      displayName: '24 hour gym',
      infographicName: 'gym',
    },
    {
      displayName: 'Active night life',
      infographicName: 'night-life',
    },
    {
      displayName: 'Bike friendly',
      infographicName: 'bike-friendly',
    },
    {
      displayName: 'Close to city center',
      infographicName: 'city-center',
    },
  ];

  const cerateSelectionModel = (multiple = true) =>
    new SelectionModel({
      items: lifestyles,
      multiple,
      textField: 'displayName',
      valueField: 'infographicName',
    });

  describe('when SelectionModel supports multiple selection', () => {
    it('should select two elements', () => {
      const selectionModel = cerateSelectionModel();
      const valuesToSelect = ['night-life', 'bike-friendly'];
      selectionModel.selectByValues(valuesToSelect);

      expect(selectionModel.selection.ids).toHaveLength(valuesToSelect.length);
      expect(selectionModel.selection.ids.every(id => valuesToSelect.includes(id)));
    });
  });

  describe('when SelectionModel does not support multiple selection', () => {
    it('should select only the last one selected', () => {
      const selectionModel = cerateSelectionModel(false);
      const valuesToSelect = ['night-life', 'bike-friendly'];
      selectionModel.selectByValues(valuesToSelect);

      expect(selectionModel.selection.ids).toHaveLength(1);
      expect(selectionModel.selection.ids[0]).toBe(valuesToSelect[1]);
    });
  });
});
