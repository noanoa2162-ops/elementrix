"use strict";
// ========================================
// Upload Component Logic
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    // Check authentication
    const currentUserTemp = storage.getCurrentUser();
    if (!currentUserTemp) {
        window.location.href = '../index.html';
        throw new Error('Not authenticated');
    }
    const currentUser = currentUserTemp;
    // Back button - always goes to store
    const backBtnUpload = document.querySelector('#backBtn');
    backBtnUpload.onclick = () => {
        sessionStorage.removeItem('returnToComponent');
        window.location.href = 'store.html';
    };
    // Add "Return to Component" button if came from component
    const returnUrl = sessionStorage.getItem('returnToComponent');
    if (returnUrl) {
        const navActions = document.querySelector('.nav-actions');
        if (navActions) {
            const returnBtn = document.createElement('button');
            returnBtn.className = 'btn btn-secondary premium-btn';
            returnBtn.style.marginLeft = '12px';
            returnBtn.innerHTML = `
                <span class="btn-icon-wrap"><i class="fas fa-arrow-left"></i></span>
                <span class="btn-text">חזור לרכיב</span>
                <div class="btn-ripple"></div>
            `;
            returnBtn.onclick = () => {
                sessionStorage.removeItem('returnToComponent');
                window.location.href = returnUrl;
            };
            navActions.insertBefore(returnBtn, backBtnUpload);
        }
    }
    // Change subtitle and submit button text based on user role
    const uploadSubtitle = document.querySelector('#uploadSubtitle');
    const submitBtn = document.querySelector('button[type="submit"]');
    if (currentUser.isAdmin) {
        uploadSubtitle.innerHTML = 'הוסף רכיב חדש לחנות - <strong>יאושר אוטומטית!</strong>';
        submitBtn.innerHTML = '<i class="fas fa-check"></i> העלה רכיב';
    }
    else {
        uploadSubtitle.innerHTML = 'שתף את היצירה שלך עם הקהילה וקבל <strong>100 נקודות</strong> לאחר אישור!';
        submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> שלח לאישור מנהל';
    }
    // Form elements
    const uploadForm = document.querySelector('#uploadForm');
    const componentName = document.querySelector('#componentName');
    const componentImage = document.querySelector('#componentImage');
    const componentPrice = document.querySelector('#componentPrice');
    const componentNameError = document.querySelector('#componentNameError');
    const componentCategoryError = document.querySelector('#componentCategoryError');
    const componentDescriptionError = document.querySelector('#componentDescriptionError');
    const componentImageError = document.querySelector('#componentImageError');
    const componentPriceError = document.querySelector('#componentPriceError');
    const componentHTMLError = document.querySelector('#componentHTMLError');
    const componentCSSError = document.querySelector('#componentCSSError');
    // Real-time validation
    const NAME_REGEX = /^[A-Za-z\u0590-\u05FF0-9 ]{3,50}$/;
    let imageBase64 = '';
    componentName.oninput = () => {
        const value = componentName.value.trim();
        if (value && !NAME_REGEX.test(value)) {
            componentNameError.textContent = 'שם הרכיב חייב להיות 3-50 תווים';
            componentNameError.classList.add('active');
        }
        else {
            componentNameError.textContent = '';
            componentNameError.classList.remove('active');
        }
    };
    componentImage.onchange = () => {
        var _a;
        const file = (_a = componentImage.files) === null || _a === void 0 ? void 0 : _a[0];
        if (file) {
            if (!file.type.startsWith('image/')) {
                componentImageError.textContent = 'נא לבחור קובץ תמונה';
                componentImageError.classList.add('active');
                imageBase64 = '';
                return;
            }
            if (file.size > 500000) { // 500KB max
                componentImageError.textContent = 'התמונה גדולה מדי (500KB מקסימום)';
                componentImageError.classList.add('active');
                imageBase64 = '';
                return;
            }
            const reader = new FileReader();
            reader.onload = (e) => {
                var _a;
                imageBase64 = (_a = e.target) === null || _a === void 0 ? void 0 : _a.result;
                componentImageError.textContent = '';
                componentImageError.classList.remove('active');
            };
            reader.readAsDataURL(file);
        }
    };
    componentPrice.oninput = () => {
        const value = Number(componentPrice.value);
        if (value && (value < 10 || value > 500)) {
            componentPriceError.textContent = 'המחיר חייב להיות בין 10 ל-500 נקודות';
            componentPriceError.classList.add('active');
        }
        else {
            componentPriceError.textContent = '';
            componentPriceError.classList.remove('active');
        }
    };
    // Upload form helper functions
    const clearUploadErrors = () => {
        const errors = [
            componentNameError, componentCategoryError, componentDescriptionError,
            componentImageError, componentPriceError, componentHTMLError, componentCSSError
        ];
        errors.forEach((error) => {
            error.textContent = '';
            error.classList.remove('active');
        });
    };
    const disableSubmitButton = (button) => {
        const originalWidth = button.offsetWidth + 'px';
        button.style.width = originalWidth;
        button.style.minWidth = originalWidth;
        button.disabled = true;
        button.style.opacity = '0.6';
        button.style.cursor = 'not-allowed';
    };
    const enableSubmitButton = (button) => {
        button.disabled = false;
        button.style.opacity = '1';
        button.style.cursor = 'pointer';
        button.style.width = '';
        button.style.minWidth = '';
    };
    const validateUploadForm = (name, category, description, price, html, css) => {
        const result = { isValid: true, errors: [] };
        if (!NAME_REGEX.test(name)) {
            componentNameError.textContent = 'שם הרכיב לא תקין';
            componentNameError.classList.add('active');
            result.isValid = false;
        }
        if (!category) {
            componentCategoryError.textContent = 'נא לבחור קטגוריה';
            componentCategoryError.classList.add('active');
            result.isValid = false;
        }
        if (description.length < 10) {
            componentDescriptionError.textContent = 'תיאור חייב להכיל לפחות 10 תווים';
            componentDescriptionError.classList.add('active');
            result.isValid = false;
        }
        if (!imageBase64) {
            componentImageError.textContent = 'נא להעלות תמונה';
            componentImageError.classList.add('active');
            result.isValid = false;
        }
        if (price < 10 || price > 500) {
            componentPriceError.textContent = 'מחיר לא תקין';
            componentPriceError.classList.add('active');
            result.isValid = false;
        }
        if (!html) {
            componentHTMLError.textContent = 'קוד HTML נדרש';
            componentHTMLError.classList.add('active');
            result.isValid = false;
        }
        if (!css) {
            componentCSSError.textContent = 'קוד CSS נדרש';
            componentCSSError.classList.add('active');
            result.isValid = false;
        }
        return result;
    };
    uploadForm.onsubmit = (e) => {
        var _a, _b, _c, _d, _e, _f, _g;
        e.preventDefault();
        const submitButton = uploadForm.querySelector('button[type="submit"]');
        if (submitButton.disabled)
            return;
        disableSubmitButton(submitButton);
        const formData = new FormData(uploadForm);
        const name = String((_a = formData.get('name')) !== null && _a !== void 0 ? _a : '').trim();
        const category = String((_b = formData.get('category')) !== null && _b !== void 0 ? _b : '');
        const description = String((_c = formData.get('description')) !== null && _c !== void 0 ? _c : '').trim();
        const price = Number((_d = formData.get('price')) !== null && _d !== void 0 ? _d : 0);
        const html = String((_e = formData.get('html')) !== null && _e !== void 0 ? _e : '').trim();
        const css = String((_f = formData.get('css')) !== null && _f !== void 0 ? _f : '').trim();
        const js = String((_g = formData.get('js')) !== null && _g !== void 0 ? _g : '').trim();
        clearUploadErrors();
        const validation = validateUploadForm(name, category, description, price, html, css);
        if (!validation.isValid) {
            showToast('נא למלא את כל השדות הנדרשים', 'error');
            enableSubmitButton(submitButton);
            return;
        }
        // Check if component with same name already exists for this user
        const existingComponents = storage.getComponentsByAuthor(currentUser.id);
        const duplicateComponent = existingComponents.find((comp) => comp.name.toLowerCase() === name.toLowerCase());
        if (duplicateComponent) {
            componentNameError.textContent = 'כבר העלת רכיב עם אותו שם! בחר שם אחר.';
            componentNameError.classList.add('active');
            showToast('רכיב עם שם זהה כבר קיים במערכת', 'error');
            // Re-enable submit button
            submitButton.disabled = false;
            submitButton.style.opacity = '1';
            submitButton.style.cursor = 'pointer';
            submitButton.style.width = '';
            submitButton.style.minWidth = '';
            return;
        }
        // Create new component
        const newComponent = {
            id: storage.generateId(),
            name: name,
            description,
            category,
            image: imageBase64,
            price,
            html,
            css,
            js,
            authorId: currentUser.id,
            authorName: currentUser.username,
            status: currentUser.isAdmin ? 'approved' : 'pending',
            rating: 0,
            ratingsCount: 0,
            purchaseCount: 0,
            createdAt: Date.now()
        };
        storage.addComponent(newComponent);
        // Add points only for non-admin users
        if (!currentUser.isAdmin) {
            currentUser.pointsPending += 100;
            storage.updateUser(currentUser);
        }
        // Create activity log
        const activity = {
            id: storage.generateId(),
            type: 'upload',
            userId: currentUser.id,
            username: currentUser.username,
            description: `${currentUser.username} העלה רכיב חדש: "${name}"`,
            timestamp: Date.now()
        };
        storage.addActivity(activity);
        if (currentUser.isAdmin) {
            showToast('הרכיב הועלה בהצלחה! ✅', 'success');
        }
        else {
            showToast('הרכיב נשלח לאישור! תקבל 100 נקודות כשיאושר 🟡', 'success');
            setTimeout(() => {
                showToast('המנהל יבדוק את הרכיב בקרוב...', 'info');
            }, 3000);
        }
        setTimeout(() => {
            // Check if should return to component
            const returnUrl = sessionStorage.getItem('returnToComponent');
            if (returnUrl) {
                sessionStorage.removeItem('returnToComponent');
                window.location.href = returnUrl;
            }
            else {
                window.location.href = currentUser.isAdmin ? 'store.html' : 'profile.html';
            }
        }, 5000);
    };
});
