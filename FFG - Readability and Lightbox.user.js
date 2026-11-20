// ==UserScript==
// @name         FFG - Readability and Lightbox
// @namespace    https://www.fantasyflightgames.com/
// @version      1.0.0
// @description  Improve typography and readability of FFG articles and add a lightbox for images
// @author       Chr1Z
// @match        https://www.fantasyflightgames.com/*
// @run-at       document-start
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    // ----------------------------------------
    // Typography and layout
    // ----------------------------------------

    function appendStyle(style) {
        if (document.documentElement) {
            document.documentElement.appendChild(style);
            return;
        }

        document.addEventListener('DOMContentLoaded', () => {
            document.documentElement.appendChild(style);
        }, { once: true });
    }

    const style = document.createElement('style');

    style.id = 'ffg-readability';
    style.textContent = `
        :root {
            --e-global-typography-text-font-family:
                system-ui, -apple-system, BlinkMacSystemFont,
                "Segoe UI", sans-serif !important;
        }

        .entry-content,
        .single-content {
            font-family: system-ui, sans-serif !important;
            font-size: 18px !important;
            line-height: 1.65 !important;
        }

        /* Main content width */

        main .container {
            max-width: 1000px !important;
            padding-left: clamp(16px, 5vw, 48px) !important;
            padding-right: clamp(16px, 5vw, 48px) !important;
        }

        .single-content > *,
        .is-layout-constrained > * {
            max-width: none !important;
            padding-left: 0 !important;
            padding-right: 0 !important;
        }

        /* Paragraph readability and alignment */

        .entry-content p,
        .entry-content h1,
        .entry-content h2,
        .entry-content h3,
        .entry-content h4,
        .single-content p,
        .single-content h1,
        .single-content h2,
        .single-content h3,
        .single-content h4,
        .single-content h5 {
            margin-left: 0 !important;
            margin-right: 0 !important;
        }

        .entry-content p,
        .single-content p {
            max-width: 75ch !important;
            margin-bottom: 1.25em !important;
            text-wrap: pretty;
        }

        /* Headings */

        .entry-content h1,
        .entry-content h2,
        .entry-content h3,
        .entry-content h4,
        .single-content h1,
        .single-content h2,
        .single-content h3,
        .single-content h4,
        .single-content h5 {
            font-family: system-ui, sans-serif !important;
            line-height: 1.25 !important;
        }

        /* Responsive adjustments */

        @media (max-width: 768px) {
            .entry-content,
            .single-content {
                font-size: 17px !important;
            }

            main .container {
                padding-left: 16px !important;
                padding-right: 16px !important;
            }
        }
    `;

    appendStyle(style);

    // ----------------------------------------
    // Image lightbox styling
    // ----------------------------------------

    const lightboxStyle = document.createElement('style');

    lightboxStyle.textContent = `
        .ffg-lightbox {
            position: fixed;
            inset: 0;
            z-index: 999999;

            display: flex;
            align-items: center;
            justify-content: center;

            padding: 0;
            background: rgba(0, 0, 0, 0.75);
            cursor: zoom-out;

            animation: ffg-fade-in 0.2s ease;
        }

        .ffg-lightbox img {
            display: block;

            width: auto !important;
            height: 70vh !important;
            max-width: 70vw !important;
            max-height: 70vh !important;

            object-fit: contain;
            cursor: default;

            box-shadow: 0 4px 30px rgba(0, 0, 0, 0.5);
        }

        /* Close button */

        .ffg-lightbox button {
            position: absolute;
            top: 16px;
            right: 24px;

            padding: 4px 12px;
            border: none;

            background: none;
            color: white;

            font-size: 36px;
            line-height: 1;

            cursor: pointer;
            opacity: 0.8;
        }

        .ffg-lightbox button:hover {
            opacity: 1;
        }

        .ffg-lightbox button:focus-visible {
            outline: 3px solid white;
            outline-offset: 3px;
        }

        /* Navigation buttons */

        .ffg-lightbox .ffg-lightbox-nav {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            z-index: 1;

            display: grid;
            place-items: center;

            box-sizing: border-box;
            width: 52px;
            height: 52px;
            padding: 0;
            padding-bottom: 4px;

            border: none;
            border-radius: 6px;
            appearance: none;

            background: rgba(255, 255, 255, 0.12);
            color: white;

            font-family: Arial, sans-serif;
            font-size: 36px;
            font-weight: normal;
            line-height: 1;

            text-align: center;
            cursor: pointer;
            opacity: 0.7;

            transition: opacity 0.2s, background 0.2s;
        }

        .ffg-lightbox .ffg-lightbox-nav:hover {
            opacity: 1;
            background: rgba(255, 255, 255, 0.25);
        }

        .ffg-lightbox .ffg-lightbox-prev {
            left: 20px;
        }

        .ffg-lightbox .ffg-lightbox-next {
            right: 20px;
        }

        /* Image counter */

        .ffg-lightbox .ffg-lightbox-counter {
            position: absolute;
            bottom: 24px;
            left: 50%;
            transform: translateX(-50%);

            padding: 8px 16px;
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 8px;

            background: rgba(0, 0, 0, 0.65);
            color: white;

            font: 600 16px/1.4 system-ui, sans-serif;
            font-variant-numeric: tabular-nums;

            opacity: 0.9;
            backdrop-filter: blur(6px);
            pointer-events: none;
        }

        /* Loading error */

        .ffg-lightbox .ffg-lightbox-error {
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);

            color: white;
            font: 16px system-ui, sans-serif;
            text-align: center;

            pointer-events: none;
        }

        @keyframes ffg-fade-in {
            from { opacity: 0; }
            to   { opacity: 1; }
        }

        @media (max-width: 768px) {
            .ffg-lightbox {
                padding: 12px;
            }

            .ffg-lightbox button {
                top: 8px;
                right: 12px;
            }

            .ffg-lightbox .ffg-lightbox-nav {
                width: 40px;
                height: 40px;
                font-size: 28px;
            }

            .ffg-lightbox .ffg-lightbox-prev {
                left: 8px;
            }

            .ffg-lightbox .ffg-lightbox-next {
                right: 8px;
            }
        }
    `;

    appendStyle(lightboxStyle);

    // ----------------------------------------
    // Image lightbox functionality
    // ----------------------------------------

    let activeLightbox = null;
    let previousOverflow = null;
    let previousFocus = null;

    let lightboxImages = [];
    let currentImageIndex = 0;

    function getImageUrl(link) {
        let url;

        try {
            url = new URL(link.href);
        } catch {
            return null;
        }

        // FFG image converter links
        if (
            url.hostname === 'www.fantasyflightgames.com' &&
            url.pathname === '/image-converter'
        ) {
            const imageUrl = url.searchParams.get('url');

            if (imageUrl) {
                try {
                    const parsed = new URL(imageUrl);

                    if (['http:', 'https:'].includes(parsed.protocol)) {
                        return parsed.href;
                    }
                } catch { }
            }
        }

        // Direct image links
        else if (/\.(png|jpe?g|gif|webp|avif)$/i.test(url.pathname)) {
            return url.href;
        }

        return null;
    }

    function preloadImage(index) {
        const image = lightboxImages[index];

        if (!image) return;

        const preload = new Image();
        preload.src = image.url;
    }

    function updateLightbox() {
        if (!activeLightbox) return;

        const image = lightboxImages[currentImageIndex];
        const img = activeLightbox.querySelector('img');
        const counter = activeLightbox.querySelector(
            '.ffg-lightbox-counter'
        );
        const error = activeLightbox.querySelector(
            '.ffg-lightbox-error'
        );

        // Reset loading state
        img.style.visibility = 'hidden';
        error.style.display = 'none';

        img.dataset.requestedUrl = image.url;
        img.src = image.url;
        img.alt = image.alt;

        counter.textContent =
            `${currentImageIndex + 1} / ${lightboxImages.length}`;

        // Preload adjacent images
        const next = (currentImageIndex + 1) % lightboxImages.length;
        const prev = (currentImageIndex - 1 + lightboxImages.length)
            % lightboxImages.length;

        preloadImage(next);
        preloadImage(prev);
    }

    function navigateLightbox(direction) {
        if (!activeLightbox || lightboxImages.length < 2) return;

        currentImageIndex =
            (currentImageIndex + direction + lightboxImages.length)
            % lightboxImages.length;

        updateLightbox();
    }

    function closeLightbox() {
        if (!activeLightbox) return;

        activeLightbox.remove();
        activeLightbox = null;

        document.body.style.overflow = previousOverflow.body;
        document.documentElement.style.overflow = previousOverflow.html;

        previousOverflow = null;
        lightboxImages = [];

        // Restore keyboard focus
        previousFocus?.focus();
        previousFocus = null;
    }

    function openLightbox(images, index) {
        closeLightbox();

        previousFocus = document.activeElement;

        lightboxImages = images;
        currentImageIndex = index;

        const overlay = document.createElement('div');
        overlay.className = 'ffg-lightbox';
        overlay.setAttribute('role', 'dialog');
        overlay.setAttribute('aria-modal', 'true');
        overlay.setAttribute('aria-label', 'Image preview');
        overlay.setAttribute('tabindex', '-1');

        const img = document.createElement('img');

        img.addEventListener('load', () => {
            if (img.dataset.requestedUrl !== img.src) return;
            img.style.visibility = 'visible';
        });

        img.addEventListener('error', () => {
            if (img.dataset.requestedUrl !== img.src) return;
            img.style.visibility = 'hidden';

            const error = overlay.querySelector(
                '.ffg-lightbox-error'
            );

            error.textContent = 'Unable to load image';
            error.style.display = '';
        });

        // Close button
        const closeButton = document.createElement('button');
        closeButton.textContent = '×';
        closeButton.setAttribute('aria-label', 'Close image preview');

        // Previous button
        const prevButton = document.createElement('button');
        prevButton.className = 'ffg-lightbox-nav ffg-lightbox-prev';
        prevButton.textContent = '‹';
        prevButton.setAttribute('aria-label', 'Previous image');

        prevButton.addEventListener('click', event => {
            event.stopPropagation();
            navigateLightbox(-1);
        });

        // Next button
        const nextButton = document.createElement('button');
        nextButton.className = 'ffg-lightbox-nav ffg-lightbox-next';
        nextButton.textContent = '›';
        nextButton.setAttribute('aria-label', 'Next image');

        nextButton.addEventListener('click', event => {
            event.stopPropagation();
            navigateLightbox(1);
        });

        // Image counter
        const counter = document.createElement('div');
        counter.className = 'ffg-lightbox-counter';

        // Image loading error
        const error = document.createElement('div');
        error.className = 'ffg-lightbox-error';
        error.style.display = 'none';

        overlay.append(
            img,
            prevButton,
            nextButton,
            counter,
            error,
            closeButton
        );

        overlay.addEventListener('click', event => {
            if (
                event.target === overlay ||
                event.target === closeButton
            ) {
                closeLightbox();
            }
        });

        document.body.appendChild(overlay);

        previousOverflow = {
            body: document.body.style.overflow,
            html: document.documentElement.style.overflow
        };

        document.body.style.overflow = 'hidden';
        document.documentElement.style.overflow = 'hidden';

        activeLightbox = overlay;

        // Hide navigation if there is only one image
        const hasMultipleImages = lightboxImages.length > 1;

        prevButton.style.display = hasMultipleImages ? '' : 'none';
        nextButton.style.display = hasMultipleImages ? '' : 'none';

        updateLightbox();
        closeButton.focus();
    }

    // ----------------------------------------
    // Keyboard navigation
    // ----------------------------------------

    document.addEventListener('keydown', event => {
        if (!activeLightbox) return;

        if (event.key === 'Tab') {
            const focusable = [
                ...activeLightbox.querySelectorAll(
                    'button:not([disabled]):not([style*="display: none"])'
                )
            ].filter(element =>
                element.offsetParent !== null
            );

            if (focusable.length === 0) {
                event.preventDefault();
                activeLightbox.focus();
                return;
            }

            const first = focusable[0];
            const last = focusable[focusable.length - 1];

            if (event.shiftKey && document.activeElement === first) {
                event.preventDefault();
                last.focus();
            } else if (
                !event.shiftKey &&
                document.activeElement === last
            ) {
                event.preventDefault();
                first.focus();
            } else if (!activeLightbox.contains(document.activeElement)) {
                event.preventDefault();
                (event.shiftKey ? last : first).focus();
            }

            return;
        }

        switch (event.key) {
            case 'Escape':
                closeLightbox();
                break;

            case 'ArrowLeft':
                event.preventDefault();
                navigateLightbox(-1);
                break;

            case 'ArrowRight':
                event.preventDefault();
                navigateLightbox(1);
                break;
        }
    });

    // ----------------------------------------
    // Intercept article image links
    // ----------------------------------------

    document.addEventListener('click', event => {
        // Only intercept ordinary left-clicks
        if (
            event.button !== 0 ||
            event.ctrlKey ||
            event.shiftKey ||
            event.altKey ||
            event.metaKey
        ) {
            return;
        }

        if (!(event.target instanceof Element)) return;

        const link = event.target.closest('a[href]');

        if (!link) return;

        const article = link.closest('.entry-content, .single-content');

        if (!article) return;

        const imageUrl = getImageUrl(link);

        if (!imageUrl) return;

        // Collect all image links from the same article
        const images = [
            ...article.querySelectorAll('a[href]')
        ]
            .map(anchor => ({
                url: getImageUrl(anchor),
                alt: anchor.querySelector('img')?.alt
                    || anchor.textContent.trim()
            }))
            .filter((image, index, array) =>
                image.url &&
                array.findIndex(item => item.url === image.url) === index
            );

        const index = images.findIndex(image => image.url === imageUrl);

        if (index === -1) return;

        event.preventDefault();

        openLightbox(images, index);
    });
})();
