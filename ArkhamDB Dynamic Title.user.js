// ==UserScript==
// @name         ArkhamDB Dynamic Title
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Update the title of ArkhamDB deck pages to include the first 30 characters of the deck name.
// @author       Chr1Z
// @match        https://*.arkhamdb.com/deck/*
// @icon         https://i.imgur.com/T3vHgln.png
// @grant        none
// ==/UserScript==

(function () {
  'use strict';

  // Function to trim the deck name and update the title
  function updateDocumentTitle(deckName) {
    if (!deckName) return;
    deckName = deckName.trim();

    if (deckName.length > 30) {
      deckName = deckName.substring(0, 30) + '...';
    }

    const targetTitle = deckName + ' · ArkhamDB';
    if (document.title !== targetTitle) {
      document.title = targetTitle;
    }
  }

  function initTracker() {
    // View Mode: Target the h1 inside the main wrapper
    const deckNameElement = document.querySelector('#wrapper .main h1');
    if (deckNameElement && deckNameElement.textContent.trim()) {
      updateDocumentTitle(deckNameElement.textContent);
      
      // Watch for dynamic text changes inside h1 (just in case)
      const viewObserver = new MutationObserver(() => updateDocumentTitle(deckNameElement.textContent));
      viewObserver.observe(deckNameElement, { childList: true, characterData: true, subtree: true });
      return true;
    }

    // Edit Mode: Target the input field
    const deckNameInput = document.querySelector('input.decklist-name');
    if (deckNameInput) {
      updateDocumentTitle(deckNameInput.value);

      deckNameInput.addEventListener('input', function () {
        updateDocumentTitle(deckNameInput.value);
      });
      return true;
    }

    return false;
  }

  const pageObserver = new MutationObserver((mutations, observer) => {
    if (initTracker()) {
      observer.disconnect(); // Stop watching the page structure once we've bound our hooks
    }
  });

  pageObserver.observe(document.body, { childList: true, subtree: true });

  // Fallback check in case everything loaded instantly
  initTracker();
})();