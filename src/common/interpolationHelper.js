/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

import { twig } from 'twig';
import { reaction } from 'mobx';
import { qsa, qs } from './dom';
import tryParse from './try-parse';

export const hydrateComponents = ({ ele, components = {}, data, keyAttribute = 'data-c' }) => {
  const componentsSelector = `[${keyAttribute}]`;
  const eles = qsa(componentsSelector, ele);

  return eles.reduce((acc, root) => {
    const key = root.getAttribute(keyAttribute);
    const { dataset = {} } = root;

    if (dataset.processed === 'true') return acc;

    const widgetCreatorFn = components[key];

    const markupData = Object.keys(dataset).reduce((accumulator, entryKey) => {
      const valueToParse = dataset[entryKey];
      accumulator[entryKey] = tryParse(valueToParse, valueToParse);
      return accumulator;
    }, {});

    if (widgetCreatorFn) {
      const disposer = widgetCreatorFn({ ele: root, markupData, data });
      acc.push(disposer);
    }

    root.setAttribute('data-processed', 'true');

    return acc;
  }, []);
};

const clearPreviousComponents = (disposers = []) => {
  disposers.forEach(dispose => dispose && dispose());
};

export const renderAndTrack = (ele, { trackFn, template: { name, text } = {}, components }) => {
  const template = twig({ id: name, data: text });
  let disposers;

  const render = data => {
    clearPreviousComponents(disposers);
    ele.innerHTML = template.render(data);
    disposers = hydrateComponents({ ele, components, data });
  };

  render(trackFn());

  reaction(trackFn, data => render(data));
};

let templateCount = 0;

export const getTemplateFromElement = selector => {
  if (!selector) throw new Error('selector is required');
  const widgetEle = qs(selector);

  if (!widgetEle) throw new Error(`selector: "${selector}" is not found`);
  const templateScript = qs('script[type="text/x-twig"]');

  if (!templateScript) throw new Error(`missing template inside "${selector}"`);
  const templateText = templateScript.innerHTML;

  widgetEle.removeChild(templateScript);

  const name = templateScript.getAttribute('name') || `unnamed_${templateCount}`;

  templateCount++;

  return { name, templateText, widgetEle };
};
