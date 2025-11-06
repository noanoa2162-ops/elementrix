"use strict";
// Back to Top Button
document.addEventListener('DOMContentLoaded', () => {
    // Create button element
    const backToTopBtn = document.createElement('button');
    backToTopBtn.className = 'back-to-top';
    backToTopBtn.innerHTML = '<i class="fas fa-chevron-up"></i>';
    backToTopBtn.setAttribute('aria-label', 'חזור למעלה');
    document.body.appendChild(backToTopBtn);
    // Show/hide button based on scroll position
    const toggleBackToTopBtn = () => {
        if (window.pageYOffset > 100) {
            backToTopBtn.classList.add('show');
        }
        else {
            backToTopBtn.classList.remove('show');
        }
    };
    // Scroll to top smoothly
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };
    // Event listeners
    window.addEventListener('scroll', toggleBackToTopBtn);
    backToTopBtn.addEventListener('click', scrollToTop);
    // No initial check - button starts hidden and shows only after scrolling
});
