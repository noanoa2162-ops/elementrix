// ========================================
// Purchase Points Logic
// ========================================

document.addEventListener('DOMContentLoaded', (): void => {
    const purchaseModal = document.querySelector<HTMLDivElement>('#purchaseModal')!;
    const purchaseModalClose = document.querySelector<HTMLButtonElement>('#purchaseModalClose');
    const purchasePointsForm = document.querySelector<HTMLFormElement>('#purchasePointsForm');
    
    // Check if should open purchase modal automatically
    if (sessionStorage.getItem('openPurchaseModal') === 'true') {
        sessionStorage.removeItem('openPurchaseModal');
        setTimeout(() => {
            if (purchaseModal) {
                purchaseModal.classList.remove('hidden');
            }
        }, 500);
    }

    if (purchaseModalClose) {
        purchaseModalClose.onclick = (): void => {
            purchaseModal.classList.add('hidden');
            purchaseModal.style.cssText = '';
            // Check if should return to component
            const returnUrl = sessionStorage.getItem('returnToComponent');
            if (returnUrl) {
                sessionStorage.removeItem('returnToComponent');
                window.location.href = returnUrl;
            }
        };
    }

    if (purchaseModal) {
        purchaseModal.onclick = (e: MouseEvent): void => {
            if (e.target === purchaseModal) {
                purchaseModal.classList.add('hidden');
                // Check if should return to component
                const returnUrl = sessionStorage.getItem('returnToComponent');
                if (returnUrl) {
                    sessionStorage.removeItem('returnToComponent');
                    window.location.href = returnUrl;
                }
            }
        };
    }

    if (purchasePointsForm) {
    const cardNumber = document.querySelector<HTMLInputElement>('#cardNumber')!;
    const expiry = document.querySelector<HTMLInputElement>('#expiry')!;
    const cvv = document.querySelector<HTMLInputElement>('#cvv')!;
    
    // Card number formatting
    cardNumber.oninput = (): void => {
        let value: string = cardNumber.value.replace(/\D/g, '');
        if (value.length > 16) value = value.slice(0, 16);
        const formatted: string = value.match(/.{1,4}/g)?.join('-') || value;
        cardNumber.value = formatted;
    };
    
    // Expiry formatting
    expiry.oninput = (): void => {
        let value: string = expiry.value.replace(/\D/g, '');
        if (value.length > 4) value = value.slice(0, 4);
        if (value.length >= 2) {
            value = value.slice(0, 2) + '/' + value.slice(2);
        }
        expiry.value = value;
    };
    
    // CVV formatting
    cvv.oninput = (): void => {
        let value: string = cvv.value.replace(/\D/g, '');
        if (value.length > 3) value = value.slice(0, 3);
        cvv.value = value;
    };
    
    purchasePointsForm.onsubmit = (e: SubmitEvent): void => {
        e.preventDefault();
        
        const currentUser: User | null = storage.getCurrentUser();
        if (!currentUser) {
            window.location.href = '../index.html';
            return;
        }
        
        const formData: FormData = new FormData(purchasePointsForm);
        const selectedPackage: string = String(formData.get('package') ?? '');
        
        // Validate package selection
        if (!selectedPackage || selectedPackage === 'null' || selectedPackage === '') {
            // Check if showToast exists
            if (typeof showToast === 'function') {
                showToast('⚠️ אנא בחר חבילת נקודות!', 'error');
            } else {
                // Fallback to manual toast
                const toast = document.getElementById('toast');
                if (toast) {
                    toast.textContent = '⚠️ אנא בחר חבילת נקודות!';
                    toast.className = 'toast show error';
                    setTimeout(() => {
                        toast.className = 'toast';
                    }, 3000);
                }
            }
            return;
        }
        
        const cardNum: string = String(formData.get('cardNumber') ?? '').replace(/\D/g, '');
        const exp: string = String(formData.get('expiry') ?? '');
        const cvvNum: string = String(formData.get('cvv') ?? '');
        const holder: string = String(formData.get('cardHolder') ?? '').trim();
        
        // Validate card number (16 digits)
        if (!/^\d{16}$/.test(cardNum)) {
            showToast('⚠️ מספר כרטיס לא תקין! נדרשים 16 ספרות', 'error');
            return;
        }
        
        // Validate expiry (MM/YY format)
        const EXPIRY_REGEX: RegExp = /^(0[1-9]|1[0-2])\/\d{2}$/;
        if (!EXPIRY_REGEX.test(exp)) {
            showToast('⚠️ תוקף לא תקין! נדרש פורמט MM/YY', 'error');
            return;
        }
        
        // Validate CVV (3 digits)
        if (!/^\d{3}$/.test(cvvNum)) {
            showToast('⚠️ CVV לא תקין! נדרשות 3 ספרות', 'error');
            return;
        }
        
        // Validate card holder name (at least 2 characters)
        if (!holder || holder.length < 2) {
            showToast('⚠️ נא להזין שם בעל הכרטיס', 'error');
            return;
        }
        
        // Calculate price
        const points: number = Number(selectedPackage);
        let price: number = 0;
        if (points === 100) price = 10;
        else if (points === 500) price = 40;
        else if (points === 1000) price = 70;
        
        // Simulate payment processing with setTimeout
        showToast('מעבד תשלום...', 'info');
        
        setTimeout((): void => {
            // Add points to user
            currentUser.pointsAvailable += points;
            currentUser.totalEarned += points;
            storage.updateUser(currentUser);
            
            // Record purchase
            const pointsPurchase: PointsPurchase = {
                id: storage.generateId(),
                userId: currentUser.id,
                points,
                price,
                timestamp: Date.now()
            };
            storage.addPointsPurchase(pointsPurchase);
            
            // Add activity
            const activity: ActivityLog = {
                id: storage.generateId(),
                type: 'buy_points',
                userId: currentUser.id,
                username: currentUser.username,
                description: `${currentUser.username} רכש ${points} נקודות`,
                timestamp: Date.now()
            };
            storage.addActivity(activity);
            
            showToast(`התשלום בוצע בהצלחה! נוספו ${points} נקודות 🎉`, 'success');
            
            purchaseModal!.classList.add('hidden');
            purchasePointsForm.reset();
            
            // Update points display if on store page
            const pointsAvailable = document.querySelector<HTMLSpanElement>('#pointsAvailable');
            if (pointsAvailable) {
                pointsAvailable.textContent = currentUser.pointsAvailable.toString();
            }
            
            // Return to component or refresh page after 2 seconds
            setTimeout((): void => {
                const returnUrl = sessionStorage.getItem('returnToComponent');
                if (returnUrl) {
                    sessionStorage.removeItem('returnToComponent');
                    window.location.href = returnUrl;
                } else {
                    location.reload();
                }
            }, 2000);
        }, 2000);
    };
}

});
