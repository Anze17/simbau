/**
 * Modern Gallery with Lightbox
 * Pure vanilla JavaScript ES6+ implementation
 * Features: Filtering, Keyboard nav, Touch swipe, Prefetch, Accessibility
 */

(function() {
    'use strict';

    // ========================================
    // STATE & ELEMENTS
    // ========================================
    const state = {
        currentIndex: 0,
        items: [],
        filteredItems: [],
        projectItems: [],
        activeFilter: 'all',
        touchStartX: 0,
        touchEndX: 0
    };

    const elements = {
        galleryGrid: document.querySelector('.gallery-grid'),
        filterBtns: document.querySelectorAll('.filter-btn'),
        galleryItems: document.querySelectorAll('.gallery-item'),
        lightbox: document.getElementById('lightbox'),
        lightboxImage: document.getElementById('lightbox-image'),
        lightboxTitle: document.getElementById('lightbox-title'),
        lightboxYear: document.getElementById('lightbox-year'),
        lightboxDescription: document.getElementById('lightbox-description'),
        lightboxCaption: document.getElementById('lightbox-caption'),
        lightboxCounter: document.getElementById('lightbox-counter'),
        closeBtn: document.querySelector('.lightbox-close'),
        prevBtn: document.querySelector('.lightbox-prev'),
        nextBtn: document.querySelector('.lightbox-next')
    };

    // ========================================
    // INITIALIZATION
    // ========================================
    function init() {
        // Convert NodeList to Array and store in state
        state.items = Array.from(elements.galleryItems);
        state.filteredItems = [...state.items];

        // Event Listeners
        attachFilterListeners();
        attachGalleryListeners();
        attachLightboxListeners();
        attachKeyboardListeners();
        attachTouchListeners();
    }



    // ========================================
    // LIGHTBOX FUNCTIONALITY
    // ========================================
    function openLightbox(index) {
        const clickedItem = state.filteredItems[index];
        const projectId = clickedItem.dataset.project;
        
        // Filter images to only show those from the same project
        state.projectItems = state.filteredItems.filter(item => 
            item.dataset.project === projectId
        );
        
        // Find the index of clicked item within project items
        state.currentIndex = state.projectItems.findIndex(item => item === clickedItem);
        
        elements.lightbox.hidden = false;
        elements.lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';

        updateLightboxContent();
        prefetchAdjacentImages();

        // Focus close button for accessibility
        elements.closeBtn.focus();
    }
    function updateLightboxContent() {
        const currentItem = state.projectItems[state.currentIndex];
        
        if (!currentItem) return;

        const img = currentItem.querySelector('.gallery-image');
        const title = currentItem.dataset.title;
        const caption = currentItem.dataset.caption;
        const year = currentItem.dataset.year;
        const description = currentItem.dataset.description;

        // Update image
        elements.lightboxImage.src = img.src;
        elements.lightboxImage.alt = img.alt;

        // Update text
        elements.lightboxTitle.textContent = title;
        elements.lightboxYear.textContent = `Leto: ${year}`;
        elements.lightboxDescription.textContent = description;
        elements.lightboxCaption.textContent = caption;

        // Update counter
        elements.lightboxCounter.textContent = 
            `${state.currentIndex + 1} / ${state.projectItems.length}`;

        // Update navigation buttons
        elements.prevBtn.disabled = state.currentIndex === 0;
        elements.nextBtn.disabled = state.currentIndex === state.projectItems.length - 1;
    }   elements.lightboxTitle.textContent = title;
        elements.lightboxCaption.textContent = caption;

        // Update counter
        elements.lightboxCounter.textContent = 
            `${state.currentIndex + 1} / ${state.filteredItems.length}`;

        // Update navigation buttons
    function navigateLightbox(direction) {
        const newIndex = state.currentIndex + direction;

        if (newIndex >= 0 && newIndex < state.projectItems.length) {
            state.currentIndex = newIndex;
            updateLightboxContent();
            prefetchAdjacentImages();
        }
    }       state.currentIndex = newIndex;
            updateLightboxContent();
    // ========================================
    // PREFETCH ADJACENT IMAGES
    // ========================================
    function prefetchAdjacentImages() {
        // Prefetch next image
        if (state.currentIndex < state.projectItems.length - 1) {
            const nextItem = state.projectItems[state.currentIndex + 1];
            const nextImg = nextItem.querySelector('.gallery-image');
            prefetchImage(nextImg.src);
        }

        // Prefetch previous image
        if (state.currentIndex > 0) {
            const prevItem = state.projectItems[state.currentIndex - 1];
            const prevImg = prevItem.querySelector('.gallery-image');
            prefetchImage(prevImg.src);
        }
    }

    function prefetchImage(src) {
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.as = 'image';
        link.href = src;
        document.head.appendChild(link);
    }

    // ========================================
    // EVENT LISTENERS - LIGHTBOX
    // ========================================
    function attachLightboxListeners() {
        // Close button
        elements.closeBtn.addEventListener('click', closeLightbox);

        // Navigation buttons
        elements.prevBtn.addEventListener('click', () => navigateLightbox(-1));
        elements.nextBtn.addEventListener('click', () => navigateLightbox(1));

        // Click outside to close
        elements.lightbox.addEventListener('click', (e) => {
            if (e.target === elements.lightbox) {
                closeLightbox();
            }
        });
    }

    // ========================================
    // KEYBOARD NAVIGATION
    // ========================================
    function attachKeyboardListeners() {
        document.addEventListener('keydown', (e) => {
            // Only handle if lightbox is open
            if (elements.lightbox.hidden) return;

            switch(e.key) {
                case 'Escape':
                    closeLightbox();
                    break;
                case 'ArrowLeft':
                    navigateLightbox(-1);
                    break;
                case 'ArrowRight':
                    navigateLightbox(1);
                    break;
            }
        });
    }

    // ========================================
    // TOUCH SWIPE SUPPORT
    // ========================================
    function attachTouchListeners() {
        elements.lightbox.addEventListener('touchstart', handleTouchStart, { passive: true });
        elements.lightbox.addEventListener('touchend', handleTouchEnd, { passive: true });
    }

    function handleTouchStart(e) {
        state.touchStartX = e.changedTouches[0].screenX;
    }

    function handleTouchEnd(e) {
        state.touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }

    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = state.touchStartX - state.touchEndX;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                // Swiped left - go to next
                navigateLightbox(1);
            } else {
                // Swiped right - go to previous
                navigateLightbox(-1);
            }
        }
    }

    // ========================================
    // START APPLICATION
    // ========================================
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();