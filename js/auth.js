"use strict";
// ========================================
// Local demo profile selection
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    const currentUser = storage.getCurrentUser();
    if (currentUser) {
        window.location.href = 'pages/store.html';
        return;
    }
    const loginTab = document.querySelector('#loginTab');
    const registerTab = document.querySelector('#registerTab');
    const loginForm = document.querySelector('#loginForm');
    const registerForm = document.querySelector('#registerForm');
    loginTab.onclick = (event) => {
        event.preventDefault();
        loginTab.classList.add('active');
        registerTab.classList.remove('active');
        loginForm.classList.remove('hidden');
        registerForm.classList.add('hidden');
    };
    registerTab.onclick = (event) => {
        event.preventDefault();
        registerTab.classList.add('active');
        loginTab.classList.remove('active');
        registerForm.classList.remove('hidden');
        loginForm.classList.add('hidden');
    };
    const loginUsernameError = document.querySelector('#loginUsernameError');
    loginForm.onsubmit = (event) => {
        var _a;
        event.preventDefault();
        const formData = new FormData(loginForm);
        const identifier = String((_a = formData.get('username')) !== null && _a !== void 0 ? _a : '').trim();
        loginUsernameError.textContent = '';
        loginUsernameError.classList.remove('active');
        if (!identifier) {
            loginUsernameError.textContent = 'שם פרופיל או אימייל נדרש';
            loginUsernameError.classList.add('active');
            return;
        }
        const user = storage.getUserByUsername(identifier) || storage.getUserByEmail(identifier);
        if (!user) {
            showToast('הפרופיל לא נמצא. אפשר ליצור פרופיל דמו חדש.', 'error');
            return;
        }
        storage.setCurrentUser(user.id);
        storage.addActivity({
            id: storage.generateId(),
            type: 'login',
            userId: user.id,
            username: user.username,
            description: `${user.username} בחר בפרופיל הדמו`,
            timestamp: Date.now()
        });
        showToast('פרופיל הדמו נטען בהצלחה', 'success');
        setTimeout(() => {
            window.location.href = 'pages/store.html';
        }, 700);
    };
    const registerUsername = document.querySelector('#registerUsername');
    const registerEmail = document.querySelector('#registerEmail');
    const registerUsernameError = document.querySelector('#registerUsernameError');
    const registerEmailError = document.querySelector('#registerEmailError');
    registerUsername.oninput = () => {
        const value = registerUsername.value.trim();
        const message = value && !USERNAME_REGEX.test(value)
            ? 'שם חייב להיות 2–20 תווים בעברית או באנגלית'
            : value && storage.getUserByUsername(value)
                ? 'שם הפרופיל כבר קיים'
                : '';
        registerUsernameError.textContent = message;
        registerUsernameError.classList.toggle('active', Boolean(message));
    };
    registerEmail.oninput = () => {
        const value = registerEmail.value.trim();
        const message = value && !EMAIL_REGEX.test(value)
            ? 'כתובת אימייל לא תקינה'
            : value && storage.getUserByEmail(value)
                ? 'האימייל כבר משויך לפרופיל דמו'
                : '';
        registerEmailError.textContent = message;
        registerEmailError.classList.toggle('active', Boolean(message));
    };
    registerForm.onsubmit = (event) => {
        var _a, _b;
        event.preventDefault();
        const formData = new FormData(registerForm);
        const username = String((_a = formData.get('username')) !== null && _a !== void 0 ? _a : '').trim();
        const email = String((_b = formData.get('email')) !== null && _b !== void 0 ? _b : '').trim();
        const usernameMessage = !USERNAME_REGEX.test(username)
            ? 'שם הפרופיל אינו תקין'
            : storage.getUserByUsername(username)
                ? 'שם הפרופיל כבר קיים'
                : '';
        const emailMessage = !EMAIL_REGEX.test(email)
            ? 'כתובת האימייל אינה תקינה'
            : storage.getUserByEmail(email)
                ? 'האימייל כבר משויך לפרופיל דמו'
                : '';
        registerUsernameError.textContent = usernameMessage;
        registerUsernameError.classList.toggle('active', Boolean(usernameMessage));
        registerEmailError.textContent = emailMessage;
        registerEmailError.classList.toggle('active', Boolean(emailMessage));
        if (usernameMessage || emailMessage) {
            showToast('נא לתקן את פרטי פרופיל הדמו', 'error');
            return;
        }
        const newUser = {
            id: storage.generateId(),
            username,
            email,
            pointsAvailable: 50,
            pointsPending: 0,
            totalEarned: 50,
            totalSpent: 0,
            isAdmin: false,
            createdAt: Date.now()
        };
        storage.addUser(newUser);
        storage.setCurrentUser(newUser.id);
        storage.addActivity({
            id: storage.generateId(),
            type: 'register',
            userId: newUser.id,
            username: newUser.username,
            description: `${newUser.username} יצר פרופיל דמו`,
            timestamp: Date.now()
        });
        showToast('פרופיל הדמו נוצר וקיבל 50 נקודות', 'success');
        setTimeout(() => {
            window.location.href = 'pages/store.html';
        }, 900);
    };
    const showToast = (message, type = 'info') => {
        const toast = document.querySelector('#toast');
        toast.textContent = message;
        toast.className = `toast ${type} show`;
        setTimeout(() => toast.classList.remove('show'), 3000);
    };
});
