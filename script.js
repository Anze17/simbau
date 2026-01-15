// Global function to initialize dropdown functionality
function initDropdowns() {
    const dropdowns = document.querySelectorAll('.dropdown');
    
    dropdowns.forEach(dropdown => {
        const toggle = dropdown.querySelector('.dropdown-toggle');
        const menu = dropdown.querySelector('.dropdown-menu');
        
        if (toggle && menu) {
            // Remove old listeners by cloning
            const newToggle = toggle.cloneNode(true);
            toggle.parentNode.replaceChild(newToggle, toggle);
            
            let clickCount = 0;
            let timeout;
            
            // Handle click on dropdown toggle
            newToggle.addEventListener('click', function(e) {
                clickCount++;
                
                // First click: show dropdown
                if (clickCount === 1) {
                    e.preventDefault();
                    
                    // Close other dropdowns
                    dropdowns.forEach(d => {
                        if (d !== dropdown) {
                            d.classList.remove('active');
                        }
                    });
                    
                    // Open current dropdown
                    dropdown.classList.add('active');
                    
                    // Reset after 5 seconds
                    clearTimeout(timeout);
                    timeout = setTimeout(function() {
                        clickCount = 0;
                    }, 5000);
                }
                // Second click: navigate
                else {
                    clearTimeout(timeout);
                    clickCount = 0;
                    // Allow default link behavior
                }
            });
        }
    });
    
    // Close dropdowns when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.dropdown')) {
            dropdowns.forEach(d => d.classList.remove('active'));
        }
    });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    // Try multiple times to catch menu loading
    setTimeout(initDropdowns, 100);
    setTimeout(initDropdowns, 300);
    setTimeout(initDropdowns, 600);
});
