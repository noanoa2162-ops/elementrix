// Expandable Search Functionality
document.addEventListener('DOMContentLoaded', () => {
    const searchToggleBtn = document.getElementById('searchToggleBtn');
    const searchInputContainer = document.querySelector('.search-input-container');
    const searchInput = document.getElementById('searchInput');
    
    if (searchToggleBtn && searchInputContainer && searchInput) {
        // Toggle search expansion
        searchToggleBtn.addEventListener('click', () => {
            const isActive = searchInputContainer.classList.contains('active');
            
            if (!isActive) {
                // Open search
                searchInputContainer.classList.add('active');
                searchToggleBtn.classList.add('active');
                setTimeout(() => {
                    searchInput.focus();
                }, 400);
            } else {
                // Close search if empty
                if (searchInput.value.trim() === '') {
                    searchInputContainer.classList.remove('active');
                    searchToggleBtn.classList.remove('active');
                }
            }
        });
        
        // Close search when clicking outside
        document.addEventListener('click', (e) => {
            if (!searchToggleBtn.contains(e.target) && 
                !searchInputContainer.contains(e.target)) {
                if (searchInput.value.trim() === '') {
                    searchInputContainer.classList.remove('active');
                    searchToggleBtn.classList.remove('active');
                }
            }
        });
        
        // Keep open while typing
        searchInput.addEventListener('input', () => {
            if (searchInput.value.trim() !== '') {
                searchInputContainer.classList.add('active');
                searchToggleBtn.classList.add('active');
            }
        });
    }
});
