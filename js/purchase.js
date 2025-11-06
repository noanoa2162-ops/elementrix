"use strict";
// ========================================
// Purchase Points Logic
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    const purchaseModal = document.querySelector('#purchaseModal');
    const purchaseModalClose = document.querySelector('#purchaseModalClose');
    const purchasePointsForm = document.querySelector('#purchasePointsForm');
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
        purchaseModalClose.onclick = () => {
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
        purchaseModal.onclick = (e) => {
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
        const cardNumber = document.querySelector('#cardNumber');
        const expiry = document.querySelector('#expiry');
        const cvv = document.querySelector('#cvv');
        // Card number formatting
        cardNumber.oninput = () => {
            var _a;
            let value = cardNumber.value.replace(/\D/g, '');
            if (value.length > 16)
                value = value.slice(0, 16);
            const formatted = ((_a = value.match(/.{1,4}/g)) === null || _a === void 0 ? void 0 : _a.join('-')) || value;
            cardNumber.value = formatted;
        };
        // Expiry formatting
        expiry.oninput = () => {
            let value = expiry.value.replace(/\D/g, '');
            if (value.length > 4)
                value = value.slice(0, 4);
            if (value.length >= 2) {
                value = value.slice(0, 2) + '/' + value.slice(2);
            }
            expiry.value = value;
        };
        // CVV formatting
        cvv.oninput = () => {
            let value = cvv.value.replace(/\D/g, '');
            if (value.length > 3)
                value = value.slice(0, 3);
            cvv.value = value;
        };
        purchasePointsForm.onsubmit = (e) => {
            var _a, _b, _c, _d, _e;
            e.preventDefault();
            const currentUser = storage.getCurrentUser();
            if (!currentUser) {
                window.location.href = '../index.html';
                return;
            }
            const formData = new FormData(purchasePointsForm);
            const selectedPackage = String((_a = formData.get('package')) !== null && _a !== void 0 ? _a : '');
            // Validate package selection
            if (!selectedPackage || selectedPackage === 'null' || selectedPackage === '') {
                // Check if showToast exists
                if (typeof showToast === 'function') {
                    showToast('⚠️ אנא בחר חבילת נקודות!', 'error');
                }
                else {
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
            const cardNum = String((_b = formData.get('cardNumber')) !== null && _b !== void 0 ? _b : '').replace(/\D/g, '');
            const exp = String((_c = formData.get('expiry')) !== null && _c !== void 0 ? _c : '');
            const cvvNum = String((_d = formData.get('cvv')) !== null && _d !== void 0 ? _d : '');
            const holder = String((_e = formData.get('cardHolder')) !== null && _e !== void 0 ? _e : '').trim();
            // Validate card number (16 digits)
            if (!/^\d{16}$/.test(cardNum)) {
                showToast('⚠️ מספר כרטיס לא תקין! נדרשים 16 ספרות', 'error');
                return;
            }
            // Validate expiry (MM/YY format)
            const EXPIRY_REGEX = /^(0[1-9]|1[0-2])\/\d{2}$/;
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
            const points = Number(selectedPackage);
            let price = 0;
            if (points === 100)
                price = 10;
            else if (points === 500)
                price = 40;
            else if (points === 1000)
                price = 70;
            // Simulate payment processing with setTimeout
            showToast('מעבד תשלום...', 'info');
            setTimeout(() => {
                // Add points to user
                currentUser.pointsAvailable += points;
                currentUser.totalEarned += points;
                storage.updateUser(currentUser);
                // Record purchase
                const pointsPurchase = {
                    id: storage.generateId(),
                    userId: currentUser.id,
                    points,
                    price,
                    timestamp: Date.now()
                };
                storage.addPointsPurchase(pointsPurchase);
                // Add activity
                const activity = {
                    id: storage.generateId(),
                    type: 'buy_points',
                    userId: currentUser.id,
                    username: currentUser.username,
                    description: `${currentUser.username} רכש ${points} נקודות`,
                    timestamp: Date.now()
                };
                storage.addActivity(activity);
                showToast(`התשלום בוצע בהצלחה! נוספו ${points} נקודות 🎉`, 'success');
                purchaseModal.classList.add('hidden');
                purchasePointsForm.reset();
                // Update points display if on store page
                const pointsAvailable = document.querySelector('#pointsAvailable');
                if (pointsAvailable) {
                    pointsAvailable.textContent = currentUser.pointsAvailable.toString();
                }
                // Return to component or refresh page after 2 seconds
                setTimeout(() => {
                    const returnUrl = sessionStorage.getItem('returnToComponent');
                    if (returnUrl) {
                        sessionStorage.removeItem('returnToComponent');
                        window.location.href = returnUrl;
                    }
                    else {
                        location.reload();
                    }
                }, 2000);
            }, 2000);
        };
    }
});
