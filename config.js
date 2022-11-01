/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

export const APP_PORT = 8081;
export const BROWSER_SYNC_PORT = 8082;

const cfgs = {
  'website.staging': {
    host: 'https://website.staging.env.reva.tech',
    token:
      '{token-created-for-website-tenant}',
  },
  'cucumber.local': {
    host: 'https://cucumber.local.env.reva.tech',
    token:
      '{token-created-for-cucumber-tenant}',
  },
};

// to test the sharon green page this configuration is needed
const cfgToUse = cfgs['website.staging'];

export const TENANT_HOST = cfgToUse?.host;
export const TOKEN = cfgToUse?.token;

export const GOOGLE_MAPS_API_TOKEN = '{your-maps-api-token}';
export const GTM_ID = '{your-tag-manager-gtm-id}';
