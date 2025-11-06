"use strict";
// ========================================
// Authentication Logic
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    // Check if user is already logged in
    const checkAuth = () => {
        try {
            // Make sure storage is loaded
            if (typeof storage === 'undefined') {
                return;
            }
            const currentUser = storage.getCurrentUser();
            if (currentUser) {
                window.location.href = 'pages/store.html';
            }
        }
        catch (error) {
            // Silent error handling
        }
    };
    checkAuth();
    // Tab switching
    const loginTab = document.querySelector('#loginTab');
    const registerTab = document.querySelector('#registerTab');
    const loginForm = document.querySelector('#loginForm');
    const registerForm = document.querySelector('#registerForm');
    loginTab.onclick = (e) => {
        e.preventDefault();
        loginTab.classList.add('active');
        registerTab.classList.remove('active');
        loginForm.classList.remove('hidden');
        registerForm.classList.add('hidden');
    };
    registerTab.onclick = (e) => {
        e.preventDefault();
        registerTab.classList.add('active');
        loginTab.classList.remove('active');
        registerForm.classList.remove('hidden');
        loginForm.classList.add('hidden');
    };
    // Login form validation
    const loginUsernameError = document.querySelector('#loginUsernameError');
    const loginPasswordError = document.querySelector('#loginPasswordError');
    loginForm.onsubmit = (e) => {
        var _a, _b;
        e.preventDefault();
        const formData = new FormData(loginForm);
        const username = String((_a = formData.get('username')) !== null && _a !== void 0 ? _a : '').trim();
        const password = String((_b = formData.get('password')) !== null && _b !== void 0 ? _b : '');
        // Clear previous errors
        loginUsernameError.textContent = '';
        loginPasswordError.textContent = '';
        loginUsernameError.classList.remove('active');
        loginPasswordError.classList.remove('active');
        let hasError = false;
        if (!username) {
            loginUsernameError.textContent = 'שם משתמש או אימייל נדרש';
            loginUsernameError.classList.add('active');
            hasError = true;
        }
        if (!password) {
            loginPasswordError.textContent = 'סיסמה נדרשת';
            loginPasswordError.classList.add('active');
            hasError = true;
        }
        if (hasError)
            return;
        // Find user
        const user = storage.getUserByUsername(username) || storage.getUserByEmail(username);
        if (!user || user.password !== password) {
            showToast('שם משתמש או סיסמה שגויים', 'error');
            return;
        }
        // Login successful
        storage.setCurrentUser(user.id);
        const activity = {
            id: storage.generateId(),
            type: 'register',
            userId: user.id,
            username: user.username,
            description: `${user.username} נכנס למערכת`,
            timestamp: Date.now()
        };
        storage.addActivity(activity);
        showToast('התחברת בהצלחה!', 'success');
        setTimeout(() => {
            window.location.href = 'pages/store.html';
        }, 1000);
    };
    // Register form validation
    const registerUsername = document.querySelector('#registerUsername');
    const registerEmail = document.querySelector('#registerEmail');
    const registerPassword = document.querySelector('#registerPassword');
    const registerPasswordConfirm = document.querySelector('#registerPasswordConfirm');
    const registerUsernameError = document.querySelector('#registerUsernameError');
    const registerEmailError = document.querySelector('#registerEmailError');
    const registerPasswordError = document.querySelector('#registerPasswordError');
    const registerPasswordConfirmError = document.querySelector('#registerPasswordConfirmError');
    // Real-time validation
    registerUsername.oninput = () => {
        const value = registerUsername.value.trim();
        if (value && !USERNAME_REGEX.test(value)) {
            registerUsernameError.textContent = 'שם חייב להיות 2-20 תווים, עברית/אנגלית, מספרים ורווחים';
            registerUsernameError.classList.add('active');
        }
        else if (value && storage.getUserByUsername(value)) {
            registerUsernameError.textContent = 'שם משתמש כבר קיים';
            registerUsernameError.classList.add('active');
        }
        else {
            registerUsernameError.textContent = '';
            registerUsernameError.classList.remove('active');
        }
    };
    registerEmail.oninput = () => {
        const value = registerEmail.value.trim();
        if (value && !EMAIL_REGEX.test(value)) {
            registerEmailError.textContent = 'כתובת אימייל לא תקינה';
            registerEmailError.classList.add('active');
        }
        else if (value && storage.getUserByEmail(value)) {
            registerEmailError.textContent = 'אימייל כבר רשום';
            registerEmailError.classList.add('active');
        }
        else {
            registerEmailError.textContent = '';
            registerEmailError.classList.remove('active');
        }
    };
    registerPassword.oninput = () => {
        const value = registerPassword.value;
        if (value && !PASSWORD_REGEX.test(value)) {
            registerPasswordError.textContent = 'סיסמה חייבת לכלול לפחות 8 תווים, אות גדולה, אות קטנה, מספר ותו מיוחד';
            registerPasswordError.classList.add('active');
        }
        else {
            registerPasswordError.textContent = '';
            registerPasswordError.classList.remove('active');
        }
    };
    registerPasswordConfirm.oninput = () => {
        const password = registerPassword.value;
        const confirm = registerPasswordConfirm.value;
        if (confirm && password !== confirm) {
            registerPasswordConfirmError.textContent = 'הסיסמאות לא תואמות';
            registerPasswordConfirmError.classList.add('active');
        }
        else {
            registerPasswordConfirmError.textContent = '';
            registerPasswordConfirmError.classList.remove('active');
        }
    };
    registerForm.onsubmit = (e) => {
        var _a, _b, _c, _d;
        e.preventDefault();
        const formData = new FormData(registerForm);
        const username = String((_a = formData.get('username')) !== null && _a !== void 0 ? _a : '').trim();
        const email = String((_b = formData.get('email')) !== null && _b !== void 0 ? _b : '').trim();
        const password = String((_c = formData.get('password')) !== null && _c !== void 0 ? _c : '');
        const passwordConfirm = String((_d = formData.get('passwordConfirm')) !== null && _d !== void 0 ? _d : '');
        // Clear previous errors
        registerUsernameError.textContent = '';
        registerEmailError.textContent = '';
        registerPasswordError.textContent = '';
        registerPasswordConfirmError.textContent = '';
        registerUsernameError.classList.remove('active');
        registerEmailError.classList.remove('active');
        registerPasswordError.classList.remove('active');
        registerPasswordConfirmError.classList.remove('active');
        let hasError = false;
        // בדיקה שכל השדות מלאים
        if (!username) {
            registerUsernameError.textContent = 'שם משתמש נדרש';
            registerUsernameError.classList.add('active');
            hasError = true;
        }
        else if (!USERNAME_REGEX.test(username)) {
            registerUsernameError.textContent = 'שם לא תקין';
            registerUsernameError.classList.add('active');
            hasError = true;
        }
        else if (storage.getUserByUsername(username)) {
            registerUsernameError.textContent = 'שם משתמש כבר קיים';
            registerUsernameError.classList.add('active');
            hasError = true;
        }
        if (!email) {
            registerEmailError.textContent = 'אימייל נדרש';
            registerEmailError.classList.add('active');
            hasError = true;
        }
        else if (!EMAIL_REGEX.test(email)) {
            registerEmailError.textContent = 'אימייל לא תקין';
            registerEmailError.classList.add('active');
            hasError = true;
        }
        else if (storage.getUserByEmail(email)) {
            registerEmailError.textContent = 'אימייל כבר רשום';
            registerEmailError.classList.add('active');
            hasError = true;
        }
        if (!password) {
            registerPasswordError.textContent = 'סיסמה נדרשת';
            registerPasswordError.classList.add('active');
            hasError = true;
        }
        else if (!PASSWORD_REGEX.test(password)) {
            registerPasswordError.textContent = 'סיסמה לא תקינה';
            registerPasswordError.classList.add('active');
            hasError = true;
        }
        if (!passwordConfirm) {
            registerPasswordConfirmError.textContent = 'אישור סיסמה נדרש';
            registerPasswordConfirmError.classList.add('active');
            hasError = true;
        }
        else if (password !== passwordConfirm) {
            registerPasswordConfirmError.textContent = 'הסיסמאות לא תואמות';
            registerPasswordConfirmError.classList.add('active');
            hasError = true;
        }
        if (hasError) {
            showToast('נא למלא את כל השדות בצורה תקינה', 'error');
            return;
        }
        // Create new user
        const newUser = {
            id: storage.generateId(),
            username,
            email,
            password,
            pointsAvailable: 50, // Bonus points
            pointsPending: 0,
            totalEarned: 50,
            totalSpent: 0,
            isAdmin: false,
            createdAt: Date.now()
        };
        storage.addUser(newUser);
        storage.setCurrentUser(newUser.id);
        const activity = {
            id: storage.generateId(),
            type: 'register',
            userId: newUser.id,
            username: newUser.username,
            description: `${newUser.username} הצטרף למערכת`,
            timestamp: Date.now()
        };
        storage.addActivity(activity);
        showToast('נרשמת בהצלחה! קיבלת 50 נקודות בונוס 🎉', 'success');
        setTimeout(() => {
            window.location.href = 'pages/store.html';
        }, 1500);
    };
    // Toast notification
    const showToast = (message, type = 'info') => {
        const toast = document.querySelector('#toast');
        toast.textContent = message;
        toast.className = `toast ${type} show`;
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    };
});
