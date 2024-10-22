// ==UserScript==
// @name         ArkhamDB Dark Mode Favicon
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Replaces the favicon with a white version for clients with dark mode
// @author       Chr1Z
// @match        https://arkhamdb.com/*
// @icon         https://i.imgur.com/T3vHgln.png
// @grant        none
// ==/UserScript==

(function () {
  'use strict';

  function setDarkModeFavicon() {
    const darkModeFavicon = 'https://i.imgur.com/T3vHgln.png';

    // Detect if the user is in dark mode
    const isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (isDarkMode) {
      // Remove existing favicons
      let favicons = document.querySelectorAll('link[rel="icon"], link[rel="apple-touch-icon"]');
      favicons.forEach(favicon => favicon.remove());

      // Create and set new dark mode favicon
      const favicon = document.createElement('link');
      favicon.rel = 'icon';
      favicon.sizes = '192x192';
      favicon.href = darkModeFavicon;
      document.head.appendChild(favicon);

      // Optionally add the apple-touch-icon as well
      const appleTouchIcon = document.createElement('link');
      appleTouchIcon.rel = 'apple-touch-icon';
      appleTouchIcon.sizes = '120x120';
      appleTouchIcon.href = 'https://i.imgur.com/sL2VXk5.png';
      document.head.appendChild(appleTouchIcon);
    }
  }

  // Initial call to set dark mode favicon
  setDarkModeFavicon();

  // Listen for changes in color scheme
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', setDarkModeFavicon);
})();