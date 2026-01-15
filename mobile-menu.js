// GLOBAL MOBILE MENU FUNCTIONS
// These functions are always available and work across all pages

// Toggle mobile menu
function toggleMobileMenu() {
    const navMenu = document.getElementById('navMenu');
    const body = document.body;
    
    if (navMenu) {
        const isActive = navMenu.classList.contains('active');
        
        if (isActive) {
            // Close menu
            navMenu.classList.remove('active');
            body.style.overflow = '';
        } else {
            // Open menu
            navMenu.classList.add('active');
            body.style.overflow = 'hidden'; // Prevent background scroll
        }
    }
}

// Toggle dropdown on mobile
function toggleDropdown(element) {
    // Only toggle on mobile (768px and below)
    if (window.innerWidth <= 768) {
        element.classList.toggle('active');
    }
    // On desktop (>768px), let CSS hover handle it
}

// Initialize mobile menu functionality
function initMobileMenu() {
    // Close menu when clicking outside on mobile
    document.addEventListener('click', function(e) {
        if (window.innerWidth <= 768) {
            const navBar = document.querySelector('.nav-bar');
            const navMenu = document.getElementById('navMenu');
            const menuToggle = document.querySelector('.mobile-menu-toggle');
            
            // If click is outside nav-bar and menu is open
            if (navMenu && navBar && !navBar.contains(e.target) && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
                
                // Close all dropdowns
                document.querySelectorAll('.dropdown').forEach(d => d.classList.remove('active'));
            }
        }
    });

    // Handle window resize
    window.addEventListener('resize', function() {
        const navMenu = document.getElementById('navMenu');
        
        // If resized to desktop, remove mobile menu classes
        if (window.innerWidth > 768) {
            if (navMenu) {
                navMenu.classList.remove('active');
            }
            document.body.style.overflow = '';
            document.querySelectorAll('.dropdown').forEach(d => d.classList.remove('active'));
        }
    });

    // Close menu when clicking on a link (on mobile)
    document.addEventListener('click', function(e) {
        if (window.innerWidth <= 768) {
            const link = e.target.closest('.nav-left a:not(.dropdown-toggle)');
            
            if (link) {
                const navMenu = document.getElementById('navMenu');
                if (navMenu) {
                    navMenu.classList.remove('active');
                    document.body.style.overflow = '';
                }
            }
        }
    });
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMobileMenu);
} else {
    initMobileMenu();
}

// Also initialize after a delay to catch dynamically loaded menus
setTimeout(initMobileMenu, 500);
