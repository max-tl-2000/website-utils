/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

import React from 'react';

export const Close = () => (
  <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
    <path d="M17.6,19L12,13.4L6.4,19L5,17.6l5.6-5.6L5,6.4L6.4,5l5.6,5.6L17.6,5L19,6.4L13.4,12l5.6,5.6L17.6,19z" />
  </svg>
);

export const Minimize = () => (
  <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
    <path d="M0 0h24v24H0V0z" fill="none" />
    <path d="M6 19h12v2H6v-2z" />
  </svg>
);

export const ChatBubble = () => (
  <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
    <path d="M12,3c5.5,0,10,3.6,10,8s-4.5,8-10,8c-1.2,0-2.4-0.2-3.5-0.5C5.6,21,2,21,2,21c2.3-2.3,2.7-3.9,2.8-4.5C3,15.1,2,13.1,2,11	C2,6.6,6.5,3,12,3z" />
  </svg>
);

export const ChatBubbleLoading = () => (
  <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
    <path d="M12,3c5.5,0,10,3.6,10,8s-4.5,8-10,8c-1.2,0-2.4-0.2-3.5-0.5C5.6,21,2,21,2,21c2.3-2.3,2.7-3.9,2.8-4.5C3,15.1,2,13.1,2,11 C2,6.6,6.5,3,12,3 M17,12v-2h-2v2H17 M13,12v-2h-2v2H13 M9,12v-2H7v2H9z" />
  </svg>
);

export const History = () => (
  <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
    <path d="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z" />
  </svg>
);

export const Send = () => (
  <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
    <path d="M2,21l21-9L2,3v7l15,2L2,14V21z" />
  </svg>
);

// TODO: Consider moving this out into a global config
export const SlideConfig = {
  classes: {
    arrows: 'splide__arrows cg-splide__arrows',
    arrow: 'splide__arrow cg-splide__arrow',
    prev: 'splide__arrow--prev cg-splide__prev',
    next: 'splide__arrow--next cg-splide__next',
  },
};
