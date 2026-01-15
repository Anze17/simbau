// Loading screen functions
let loadingTimeout = null;
let loadingShown = false;

// Show loading screen only if loading takes too long
function showLoading() {
    const loadingScreen = document.querySelector('.loading-screen');
    if (loadingScreen) {
        loadingScreen.classList.remove('hidden');
        loadingShown = true;
    }
}

// Hide loading screen
function hideLoading() {
    const loadingScreen = document.querySelector('.loading-screen');
    if (loadingScreen) {
        loadingScreen.classList.add('hidden');
        loadingShown = false;
    }
    if (loadingTimeout) {
        clearTimeout(loadingTimeout);
        loadingTimeout = null;
    }
}

// Auto-hide loading screen when page is fully loaded
window.addEventListener('load', () => {
    // Hide immediately if page loads fast
    hideLoading();
});

// Navigate with loading screen - only show if navigation takes time
function navigateWithLoading(url) {
    // Set timeout to show loading only after 1200ms
    loadingTimeout = setTimeout(() => {
        showLoading();
    }, 1200);
    
    // Navigate immediately
    window.location.href = url;
}

// Add loading to all internal links (optional - automatic mode)
document.addEventListener('DOMContentLoaded', () => {
    // Get all links that point to internal HTML pages
    const internalLinks = document.querySelectorAll('a[href$=".html"]');
    
    internalLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            // Only add loading for internal links (not external)
            if (href && !href.startsWith('http') && !link.hasAttribute('data-no-loading')) {
                e.preventDefault();
                navigateWithLoading(href);
            }
        });
    });

    // Also handle button clicks that navigate via onclick
    const navButtons = document.querySelectorAll('button[onclick*="location.href"]');
    navButtons.forEach(button => {
        const originalOnclick = button.getAttribute('onclick');
        button.removeAttribute('onclick');
        button.addEventListener('click', () => {
            const urlMatch = originalOnclick.match(/location\.href\s*=\s*['"]([^'"]+)['"]/);
            if (urlMatch && urlMatch[1]) {
                navigateWithLoading(urlMatch[1]);
            }
        });
    });
});
