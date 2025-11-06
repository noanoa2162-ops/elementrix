// Store Page Main Logic

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    
    // Explore button smooth scroll
    const exploreBtn = document.getElementById('exploreBtn');
    if (exploreBtn) {
        exploreBtn.addEventListener('click', () => {
            const grid = document.getElementById('componentsGrid');
            if (grid) {
                grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    }
    
    // Upload button - show upload modal
    const uploadBtn = document.getElementById('uploadBtn');
    if (uploadBtn) {
        uploadBtn.addEventListener('click', () => {
            if (window.showUploadModal) window.showUploadModal();
        });
    }
    
    // Points display click - show purchase modal
    const pointsDisplay = document.getElementById('pointsDisplay');
    const purchaseModal = document.getElementById('purchaseModal');
    if (pointsDisplay && purchaseModal) {
        pointsDisplay.addEventListener('click', () => {
            purchaseModal.classList.remove('hidden');
        });
    }
    
    // Close purchase modal
    const purchaseModalClose = document.getElementById('purchaseModalClose');
    if (purchaseModalClose && purchaseModal) {
        purchaseModalClose.addEventListener('click', () => {
            purchaseModal.classList.add('hidden');
        });
    }
    
    // Close component modal
    const modalClose = document.getElementById('modalClose');
    const componentModal = document.getElementById('componentModal');
    if (modalClose && componentModal) {
        modalClose.addEventListener('click', () => {
            componentModal.classList.add('hidden');
        });
    }
    
    // Close modals on background click
    [purchaseModal, componentModal].forEach(modal => {
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.classList.add('hidden');
                }
            });
        }
    });
});
