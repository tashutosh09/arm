/**
 * Check out https://googlechromelabs.github.io/sw-toolbox/ for
 * more info on how to use sw-toolbox to custom configure your service worker.
 */


'use strict';
importScripts('./build/sw-toolbox.js');

self.toolbox.options.cache = {
  name: 'gtddl-arm-cache'
};

// pre-cache our key assets
self.toolbox.precache(
  [
    // './build/main.js',
    './build/vendor.js',
    './build/main.css',
    './build/polyfills.js',
    'index.html',
    'manifest.json',
    // Cahce Piviot table scripts
    'https://cdnjs.cloudflare.com/ajax/libs/c3/0.4.11/c3.min.css',
    'https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.11.4/jquery-ui.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/d3/3.5.5/d3.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/jqueryui-touch-punch/0.2.3/jquery.ui.touch-punch.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/PapaParse/4.1.2/papaparse.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/c3/0.4.11/c3.min.js',
    './build/piviot/pivot.css',
    './build/piviot/pivot.js',
    './build/piviot/d3_renderers.js',
    './build/piviot/c3_renderers.js',
    './build/piviot/export_renderers.js',
  ]
);

// dynamically cache any other local assets
self.toolbox.router.any('/*', self.toolbox.fastest);

// for any other requests go to the network, cache,
// and then only use that cached resource if your user goes offline
self.toolbox.router.default = self.toolbox.networkFirst;


