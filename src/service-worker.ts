/// <reference lib="webworker" />
/* eslint-disable no-restricted-globals */

import { clientsClaim } from 'workbox-core';
import { ExpirationPlugin } from 'workbox-expiration';
import { precacheAndRoute, createHandlerBoundToURL } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { StaleWhileRevalidate } from 'workbox-strategies';

declare const self: ServiceWorkerGlobalScope;

clientsClaim();

precacheAndRoute(self.__WB_MANIFEST);

const fileExtensionRegexp = new RegExp('/[^/?]+\\.[^/]+$');
registerRoute(
    ({ request, url }: { request: Request; url: URL }) => {
        if (request.mode !== 'navigate') {
            return false;
        }
        if (url.pathname.startsWith('/_')) {
            return false;
        }
        if (url.pathname.match(fileExtensionRegexp)) {
            return false;
        }
        return true;
    },
    createHandlerBoundToURL(process.env.PUBLIC_URL + '/index.html')
);

registerRoute(
    ({ url }) => url.origin === self.location.origin,
    new StaleWhileRevalidate({
        cacheName: 'dynamic-cache',
        plugins: [
            new ExpirationPlugin({ maxAgeSeconds: 0 })
        ],
    })
);

self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});

self.addEventListener('install', event => {
    self.skipWaiting();
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(
                keys.map(key => caches.delete(key))
            );
        })
    );
    return self.clients.claim();
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        fetch(event.request).then((response) => {
            return response;
        })
    );
});