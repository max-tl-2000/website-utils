/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

import Twig from 'twig';
import express from 'express';
import path from 'path';
import serveStatic from 'serve-static';
import favicon from 'serve-favicon';
import httpProxy from 'http-proxy';
import http from 'http';
import trim from 'jq-trim';
import { BROWSER_SYNC_PORT, APP_PORT, TOKEN, TENANT_HOST, GOOGLE_MAPS_API_TOKEN, GTM_ID } from '../config';

const { env } = process;

const app = express();

app.use(
  favicon(path.join(__dirname, './assets/', 'favicon.ico'), {
    maxAge: '1y',
  }),
);

const setHeaders = res => {
  res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
};

app.use('/assets/', serveStatic(path.join(__dirname, './assets'), { maxAge: '0', setHeaders }));
app.use(serveStatic(path.join(__dirname, '../predist'), { maxAge: '0', setHeaders }));
app.use(serveStatic(path.join(__dirname, '../dist'), { maxAge: '0', setHeaders }));

let proxy;

if (env.NODE_ENV !== 'production') {
  proxy = httpProxy.createProxyServer({
    target: `http://localhost:${BROWSER_SYNC_PORT}`,
    ws: true,
  });

  proxy.on('error', (error, req, res) => {
    console.error({ error }, 'proxy error');

    if (!res.headersSent) {
      res.writeHead(500, {
        'content-type': 'application/json',
      });
    }

    const json = {
      error: 'proxy_error',
      reason: error.message,
    };

    res.end(JSON.stringify(json));
  });

  // Proxy to browser-sync
  app.use('/browser-sync', (req, res) => {
    req.url = `/browser-sync/${req.url}`;
    proxy.web(req, res);
  });
}

Twig.cache(false);

const checkIfShouldUseMin = resource => {
  if (env.NODE_ENV === 'production') {
    resource = resource.replace(/\.js$|\.css$/i, '.min$&');
  }

  return resource;
};

const _renderView = ({ getView, getData, req, res, next }) => {
  if (getData && typeof getData !== 'function') throw new Error('getData is not a function');
  if (typeof getView !== 'function') throw new Error('getView is not a function');

  const ua = trim(req.headers['user-agent']);

  const useLegacy = ua.match(/Trident.*/) || env.REVA_USE_LEGACY;

  const jsResource = checkIfShouldUseMin(useLegacy ? '/website-utils-legacy.js' : '/website-utils.js');
  const cssAsset = checkIfShouldUseMin(useLegacy ? '/website-utils-legacy.css' : '/website-utils.css');
  const assetsBasePath = '';
  const cssResource = env.NODE_ENV === 'production' ? cssAsset : undefined;

  const data = getData ? getData(req) || {} : {};

  const view = getView();
  if (!view) throw new Error('view not defined');

  const templateFile = path.join(__dirname, './views/', view);

  Twig.renderFile(
    templateFile,
    {
      TOKEN,
      TENANT_HOST,
      GOOGLE_MAPS_API_TOKEN,
      GTM_ID,
      ASSETS_BASE_PATH: assetsBasePath,
      dev: env.NODE_ENV !== 'production' && !useLegacy,
      jsResource,
      cssResource,
      ...data,
    },
    (err, html) => {
      if (err) {
        next(err);
        return;
      }
      res.status(200).send(html);
    },
  );
};

const renderView = ({ getView, getData, req, res, next }) => {
  try {
    _renderView({ getView, getData, req, res, next });
  } catch (err) {
    next(err);
  }
};

const getPageCSS = req => {
  const { templateName = 'home' } = req.params;
  const map = {
    'phone-replacement': '/pages/phone-replacement.css',
    'sharon-green': '/pages/sharon-green.css',
    booker: '/pages/sharon-green.css',
  };

  return map[templateName] || '/pages/website.css';
};

app.get('/property/:propertyId*', (req, res, next) => {
  // const propertyLogoURL = '/denver/dylan-rino-apartments

  const logoMap = {
    '/denver/dylan-rino-apartments': '/assets/logos/Dylan_BlackLogo.png',
    '/denver/westend-apartments': '/assets/logos/Westend_BlackLogo.png',
    '/st-cloud-metro/regency-park-estates': '/notFound.png',
  };

  const key = req.params[0];

  const propertyLogoURL = logoMap[key] || '';

  renderView({
    req,
    res,
    next,
    getView: () => 'property.twig',
    getData: () => ({
      slug: `${req.params.propertyId}${req.params[0]}`,
      propertyLogoURL,
      tenantLogoURL: '/assets/logos/logo.svg',
      pageCSS: getPageCSS(req),
    }),
  });
});

app.get('/communities/:type?/:state?/:city?/:name?', (req, res, next) => {
  renderView({
    req,
    res,
    next,
    getData: () => ({ tenantLogoURL: '/assets/logos/logo.svg', pageCSS: getPageCSS(req) }),
    getView: () => 'communities.twig',
  });
});

app.get('/:templateName?', (req, res, next) => {
  renderView({
    req,
    res,
    next,
    getData: () => ({ tenantLogoURL: '/assets/logos/logo.svg', pageCSS: getPageCSS(req) }),
    getView: () => {
      const { templateName = 'home' } = req.params;
      if (!templateName.match(/home|about|book-appointment|phone-replacement|sharon-green|booker|investors|login|residents/)) {
        throw new Error(`Route not allowed: ${templateName}`);
      }

      return `${templateName}.twig`;
    },
  });
});

const server = http.createServer(app).listen(APP_PORT, () => console.log(`>>> app started on port ${APP_PORT}`));

if (env.NODE_ENV !== 'production') {
  server.on('upgrade', (req, socket) => {
    proxy && proxy.ws(req, socket);
  });
}
