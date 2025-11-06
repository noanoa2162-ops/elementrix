// Footer Newsletter functionality
document.addEventListener('DOMContentLoaded', () => {
    const newsletterForm = document.querySelector('.newsletter-form');
    
    if (newsletterForm) {
        const input = newsletterForm.querySelector('input[type="email"]');
        const button = newsletterForm.querySelector('button');
        
        if (button && input) {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                
                const email = input.value.trim();
                
                // Validate email
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                
                if (!email) {
                    showToast('נא להזין כתובת אימייל', 'error');
                    return;
                }
                
                if (!emailRegex.test(email)) {
                    showToast('נא להזין כתובת אימייל תקינה', 'error');
                    return;
                }
                
                // Success animation
                button.disabled = true;
                button.innerHTML = '<i class="fas fa-check"></i> <span>נשלח!</span>';
                button.style.background = '#10b981';
                
                setTimeout(() => {
                    // Clear input
                    input.value = '';
                    input.blur();
                    
                    // Show success message
                    showToast('תודה! נרשמת בהצלחה לניוזלטר 📧', 'success');
                    
                    // Reset button after animation
                    setTimeout(() => {
                        button.innerHTML = '<i class="fas fa-paper-plane"></i> <span>שלח</span>';
                        button.style.background = '';
                        button.disabled = false;
                    }, 1500);
                }, 300);
            });
            
            // Allow Enter key to submit
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    button.click();
                }
            });
        }
    }
});
