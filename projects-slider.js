// ==========================================
// SIMPLE ARCHITECTURAL PROJECTS SLIDER
// ==========================================

document.addEventListener('DOMContentLoaded', function() {
    initSimpleSlider();
});

function initSimpleSlider() {
    let currentIndex = 0;
    const track = document.getElementById('projectsTrack');
    const cards = document.querySelectorAll('.project-card');
    const totalProjects = cards.length;
    const prevBtn = document.getElementById('prevArrow');
    const nextBtn = document.getElementById('nextArrow');
    const dotsContainer = document.getElementById('projectsDots');
    const currentIndexEl = document.getElementById('currentIndex');
    const totalProjectsEl = document.getElementById('totalProjects');

    // Exit if elements don't exist
    if (!track || !prevBtn || !nextBtn || totalProjects === 0) {
        console.log('Slider elements not found');
        return;
    }

    console.log('Simple slider initialized with', totalProjects, 'projects');

    // Create dots
    function createDots() {
        dotsContainer.innerHTML = '';
        for (let i = 0; i < totalProjects; i++) {
            const dot = document.createElement('button');
            dot.classList.add('project-dot');
            dot.setAttribute('aria-label', `Projekt ${i + 1}`);
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToProject(i));
            dotsContainer.appendChild(dot);
        }
    }

    // Update slider
    function updateSlider() {
        // Move track
        track.style.transform = `translateX(-${currentIndex * 100}%)`;

        // Update dots
        const dots = document.querySelectorAll('.project-dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });

        // Update counter
        if (currentIndexEl) {
            currentIndexEl.textContent = currentIndex + 1;
        }

        // Update buttons
        prevBtn.disabled = currentIndex === 0;
        nextBtn.disabled = currentIndex === totalProjects - 1;

        console.log('Moved to project', currentIndex + 1);
    }

    // Navigate to specific project
    function goToProject(index) {
        if (index >= 0 && index < totalProjects) {
            currentIndex = index;
            updateSlider();
        }
    }

    // Navigate prev/next
    function navigate(direction) {
        currentIndex += direction;
        if (currentIndex < 0) currentIndex = 0;
        if (currentIndex >= totalProjects) currentIndex = totalProjects - 1;
        updateSlider();
    }

    // Initialize
    function init() {
        createDots();
        
        if (totalProjectsEl) {
            totalProjectsEl.textContent = totalProjects;
        }

        updateSlider();

        // Button events
        prevBtn.addEventListener('click', () => navigate(-1));
        nextBtn.addEventListener('click', () => navigate(1));
    }

    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowLeft') navigate(-1);
        if (e.key === 'ArrowRight') navigate(1);
    });

    // Touch swipe
    let touchStartX = 0;
    let touchEndX = 0;
    const minSwipe = 50;

    track.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    track.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        const swipeDistance = touchStartX - touchEndX;
        
        if (swipeDistance > minSwipe) navigate(1);
        else if (swipeDistance < -minSwipe) navigate(-1);
    }, { passive: true });

    // Start slider
    init();
}